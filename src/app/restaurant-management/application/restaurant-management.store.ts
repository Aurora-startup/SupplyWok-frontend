import { Injectable, signal, computed } from '@angular/core';
import { TableApi } from '../infrastructure/table-api';
import { ComandaApi } from '../infrastructure/comanda-api';
import { Table } from '../domain/model/table.entity';
import { Comanda, ComandaItem } from '../domain/model/comanda.entity';
import { ComandaStatus, COMANDA_STATUS_ORDER } from '../domain/enums/comanda-status.enum';
import { TableStatus } from '../domain/enums/table-status.enum';
import { SensorState } from '../domain/enums/sensor-state.enum';

@Injectable({ providedIn: 'root' })
export class RestaurantManagementStore {
  readonly tables = signal<Table[]>([]);
  readonly comandas = signal<Comanda[]>([]);
  readonly totalCapacity = signal(24);

  readonly occupiedCount = computed(() => this.tables().filter(t => t.status === TableStatus.OCCUPIED).length);
  readonly freeCount = computed(() => this.tables().filter(t => t.status === TableStatus.FREE).length);
  readonly occupancyPercent = computed(() => {
    const total = this.totalCapacity();
    return total > 0 ? Math.round((this.occupiedCount() / total) * 100) : 0;
  });
  readonly zones = computed(() => [...new Set(this.tables().map(t => t.zone))]);
  readonly availableTables = computed(() => this.tables().filter(t => t.status === TableStatus.OCCUPIED || t.status === TableStatus.FREE));

  readonly statusCounts = computed(() => {
    const all = this.comandas();
    return {
      total: all.length,
      EN_COLA: all.filter(c => c.status === ComandaStatus.EN_COLA).length,
      EN_PREPARACION: all.filter(c => c.status === ComandaStatus.EN_PREPARACION).length,
      LISTO: all.filter(c => c.status === ComandaStatus.LISTO).length,
      ENTREGADO: all.filter(c => c.status === ComandaStatus.ENTREGADO).length,
    };
  });

  constructor(
    private tableApi: TableApi,
    private comandaApi: ComandaApi,
  ) {}

  loadTables(): void {
    this.tableApi.getTables().subscribe(tables => this.tables.set(tables));
  }

  loadComandas(): void {
    this.comandaApi.getComandas().subscribe(comandas => this.comandas.set(comandas));
  }

  checkoutTable(table: Table): void {
    const updated = new Table({
      id: table.id, number: table.number, capacity: table.capacity,
      status: TableStatus.FREE, zone: table.zone, dwellTime: 0, sensorState: SensorState.IDLE
    });
    this.tableApi.updateTable(updated).subscribe(() => {
      this.tables.update(list =>
        list.map(t => t.id === table.id ? updated : t)
      );
    });
  }

  assignGuest(table: Table): void {
    const updated = new Table({
      id: table.id, number: table.number, capacity: table.capacity,
      status: TableStatus.OCCUPIED, zone: table.zone, dwellTime: table.dwellTime, sensorState: SensorState.ACTIVE
    });
    this.tableApi.updateTable(updated).subscribe(() => {
      this.tables.update(list =>
        list.map(t => t.id === table.id ? updated : t)
      );
    });
  }

  advanceComandaStatus(comanda: Comanda): void {
    const nextIndex = COMANDA_STATUS_ORDER.indexOf(comanda.status) + 1;
    if (nextIndex >= COMANDA_STATUS_ORDER.length) return;

    const nextStatus = COMANDA_STATUS_ORDER[nextIndex];
    const now = new Date().toISOString();
    const updated = new Comanda({
      id: comanda.id, tableId: comanda.tableId, tableNumber: comanda.tableNumber,
      items: comanda.items, status: nextStatus, createdAt: comanda.createdAt, updatedAt: now
    });
    this.comandaApi.updateComanda(updated).subscribe(() => {
      this.comandas.update(list =>
        list.map(c => c.id === comanda.id ? updated : c)
      );
    });
  }

  createComanda(tableId: number, items: Partial<ComandaItem>[]): { success: boolean; errorKey?: string } {
    if (!tableId) return { success: false, errorKey: 'restaurant-management.kitchen.error-no-table' };
    const validItems = items.filter(i => i.dishName?.trim());
    if (validItems.length === 0) return { success: false, errorKey: 'restaurant-management.kitchen.error-no-items' };

    const table = this.tables().find(t => t.id === tableId);
    const now = new Date().toISOString();
    const comanda = new Comanda({
      tableId,
      tableNumber: table?.number ?? 0,
      items: validItems.map((item, i) => ({ id: i + 1, dishName: item.dishName!, quantity: item.quantity ?? 1 })),
      status: ComandaStatus.EN_COLA,
      createdAt: now,
      updatedAt: now,
    });

    this.comandaApi.createComanda(comanda).subscribe({
      next: created => this.comandas.update(list => [...list, created]),
    });
    return { success: true };
  }

  getTableLabel(table: Table): string {
    return `T-${String(table.number).padStart(2, '0')}`;
  }

  getZoneLabel(zone: string): string {
    return zone.charAt(0).toUpperCase() + zone.slice(1).replace(/-/g, ' ');
  }

  getDwellTimeFormatted(seconds: number): string {
    if (seconds <= 0) return '-- : --';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    return `${minutes}m ${String(secs).padStart(2, '0')}s`;
  }

  getElapsedTime(createdAt: string): string {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  getNextStatus(current: ComandaStatus): ComandaStatus | null {
    const index = COMANDA_STATUS_ORDER.indexOf(current);
    return index < COMANDA_STATUS_ORDER.length - 1 ? COMANDA_STATUS_ORDER[index + 1] : null;
  }
}
