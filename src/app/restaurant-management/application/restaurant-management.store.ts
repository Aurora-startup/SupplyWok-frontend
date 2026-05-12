import { Injectable, signal, computed } from '@angular/core';
import { TableApi } from '../infrastructure/table-api';
import { ComandaApi } from '../infrastructure/comanda-api';
import { TableAssembler } from '../infrastructure/table.assembler';
import { ComandaAssembler } from '../infrastructure/comanda.assembler';
import { Table } from '../domain/model/table.entity';
import { Comanda, ComandaStatus, ComandaItem } from '../domain/model/comanda.entity';

@Injectable({ providedIn: 'root' })
export class RestaurantManagementStore {
  readonly tables = signal<Table[]>([]);
  readonly comandas = signal<Comanda[]>([]);
  readonly totalCapacity = signal(24);

  readonly occupiedCount = computed(() => this.tables().filter(t => t.status === 'OCCUPIED').length);
  readonly freeCount = computed(() => this.tables().filter(t => t.status === 'FREE').length);
  readonly occupancyPercent = computed(() => {
    const total = this.totalCapacity();
    return total > 0 ? Math.round((this.occupiedCount() / total) * 100) : 0;
  });
  readonly zones = computed(() => [...new Set(this.tables().map(t => t.zone))]);
  readonly availableTables = computed(() => this.tables().filter(t => t.status === 'OCCUPIED' || t.status === 'FREE'));

  readonly statusCounts = computed(() => {
    const all = this.comandas();
    return {
      total: all.length,
      EN_COLA: all.filter(c => c.status === 'EN_COLA').length,
      EN_PREPARACION: all.filter(c => c.status === 'EN_PREPARACION').length,
      LISTO: all.filter(c => c.status === 'LISTO').length,
      ENTREGADO: all.filter(c => c.status === 'ENTREGADO').length,
    };
  });

  constructor(
    private tableApi: TableApi,
    private comandaApi: ComandaApi,
  ) {}

  loadTables(): void {
    this.tableApi.getAll().subscribe(tables => this.tables.set(tables));
  }

  loadComandas(): void {
    this.comandaApi.getAll().subscribe(comandas => this.comandas.set(comandas));
  }

  checkoutTable(table: Table): void {
    this.tableApi.updateStatus(table.id, 'FREE').subscribe(() => {
      this.tables.update(list =>
        list.map(t => t.id === table.id ? { ...t, status: 'FREE' as const, dwellTime: 0, sensorState: 'idle' as const } : t)
      );
    });
  }

  assignGuest(table: Table): void {
    this.tableApi.updateStatus(table.id, 'OCCUPIED').subscribe(() => {
      this.tables.update(list =>
        list.map(t => t.id === table.id ? { ...t, status: 'OCCUPIED' as const, sensorState: 'active' as const } : t)
      );
    });
  }

  advanceComandaStatus(comanda: Comanda): void {
    const next = ComandaAssembler.getNextStatus(comanda.status);
    if (!next || !ComandaAssembler.canAdvance(comanda.status, next)) return;
    this.comandaApi.updateStatus(comanda.id, next).subscribe(() => {
      this.comandas.update(list =>
        list.map(c => c.id === comanda.id ? { ...c, status: next, updatedAt: new Date().toISOString() } : c)
      );
    });
  }

  createComanda(tableId: number, items: Partial<ComandaItem>[]): { success: boolean; errorKey?: string } {
    if (!tableId) return { success: false, errorKey: 'restaurant-management.kitchen.error-no-table' };
    const validItems = items.filter(i => i.dishName?.trim());
    if (validItems.length === 0) return { success: false, errorKey: 'restaurant-management.kitchen.error-no-items' };

    const table = this.tables().find(t => t.id === tableId);
    const payload = ComandaAssembler.toCreatePayload({
      tableId,
      tableNumber: table?.number ?? 0,
      items: validItems.map((item, i) => ({ id: i + 1, dishName: item.dishName!, quantity: item.quantity ?? 1 })),
    });

    this.comandaApi.create(payload).subscribe({
      next: created => this.comandas.update(list => [...list, created]),
    });
    return { success: true };
  }

  getTableLabel(table: Table): string {
    return TableAssembler.toLabel(table);
  }

  getZoneLabel(zone: string): string {
    return TableAssembler.toZoneLabel(zone);
  }

  getDwellTimeFormatted(seconds: number): string {
    return TableAssembler.toDwellTimeFormatted(seconds);
  }

  getElapsedTime(createdAt: string): string {
    return ComandaAssembler.toElapsedTime(createdAt);
  }

  getNextStatus(current: ComandaStatus): ComandaStatus | null {
    return ComandaAssembler.getNextStatus(current);
  }

  getTableLabelByNumber(num: number): string {
    return `T-${String(num).padStart(2, '0')}`;
  }
}
