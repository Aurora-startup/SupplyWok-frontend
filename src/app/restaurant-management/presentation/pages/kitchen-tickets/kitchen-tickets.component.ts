import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComandaService } from '../../../services/comanda.service';
import { Comanda, ComandaStatus, ComandaItem } from '../../../model/comanda.entity';
import { TableService } from '../../../services/table.service';
import { Table } from '../../../model/table.entity';

@Component({
  selector: 'app-kitchen-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './kitchen-tickets.component.html',
  styleUrl: './kitchen-tickets.component.css',
})
export class KitchenTicketsComponent implements OnInit {
  comandas = signal<Comanda[]>([]);
  tables = signal<Table[]>([]);
  statusFilter = signal<string>('');
  showCreateForm = signal(false);

  newComandaTableId = signal<number | null>(null);
  newComandaItems = signal<Partial<ComandaItem>[]>([{ dishName: '', quantity: 1 }]);
  createError = signal('');

  filteredComandas = computed(() => {
    const filter = this.statusFilter();
    if (!filter) return this.comandas();
    return this.comandas().filter(c => c.status === filter);
  });

  statusCounts = computed(() => {
    const all = this.comandas();
    return {
      total: all.length,
      EN_COLA: all.filter(c => c.status === 'EN_COLA').length,
      EN_PREPARACION: all.filter(c => c.status === 'EN_PREPARACION').length,
      LISTO: all.filter(c => c.status === 'LISTO').length,
      ENTREGADO: all.filter(c => c.status === 'ENTREGADO').length,
    };
  });

  availableTables = computed(() => this.tables().filter(t => t.status === 'OCCUPIED' || t.status === 'FREE'));

  constructor(
    private comandaService: ComandaService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.comandaService.getComandas().subscribe(comandas => this.comandas.set(comandas));
    this.tableService.getTables().subscribe(tables => this.tables.set(tables));
  }

  getElapsedTime(comanda: Comanda): string {
    return this.comandaService.getElapsedTime(comanda.createdAt);
  }

  getNextStatus(current: ComandaStatus): ComandaStatus | null {
    return this.comandaService.getNextStatus(current);
  }

  advanceStatus(comanda: Comanda): void {
    const next = this.getNextStatus(comanda.status);
    if (!next) return;
    this.comandaService.updateComandaStatus(comanda.id, next, comanda.status).subscribe(updated => {
      this.comandas.update(list =>
        list.map(c => c.id === comanda.id ? { ...c, status: next, updatedAt: new Date().toISOString() } : c)
      );
    });
  }

  onFilterChange(status: string): void {
    this.statusFilter.set(status);
  }

  toggleCreateForm(): void {
    this.showCreateForm.update(v => !v);
    this.createError.set('');
    if (this.showCreateForm()) {
      this.newComandaTableId.set(null);
      this.newComandaItems.set([{ dishName: '', quantity: 1 }]);
    }
  }

  addItem(): void {
    this.newComandaItems.update(items => [...items, { dishName: '', quantity: 1 }]);
  }

  removeItem(index: number): void {
    this.newComandaItems.update(items => items.filter((_, i) => i !== index));
  }

  updateItemName(index: number, value: string): void {
    this.newComandaItems.update(items =>
      items.map((item, i) => i === index ? { ...item, dishName: value } : item)
    );
  }

  updateItemQuantity(index: number, value: number): void {
    this.newComandaItems.update(items =>
      items.map((item, i) => i === index ? { ...item, quantity: value } : item)
    );
  }

  onSelectTable(tableId: string): void {
    this.newComandaTableId.set(tableId ? Number(tableId) : null);
  }

  submitComanda(): void {
    const tableId = this.newComandaTableId();
    const items = this.newComandaItems().filter(i => i.dishName?.trim());

    if (!tableId) {
      this.createError.set('restaurant-management.kitchen.error-no-table');
      return;
    }
    if (items.length === 0) {
      this.createError.set('restaurant-management.kitchen.error-no-items');
      return;
    }

    const table = this.tables().find(t => t.id === tableId);
    const comanda: Partial<Comanda> = {
      tableId,
      tableNumber: table?.number ?? 0,
      items: items.map((item, i) => ({
        id: i + 1,
        dishName: item.dishName!,
        quantity: item.quantity ?? 1,
      })),
    };

    this.comandaService.createComanda(comanda).subscribe({
      next: (created) => {
        this.comandas.update(list => [...list, created]);
        this.toggleCreateForm();
      },
      error: () => {
        this.createError.set('restaurant-management.kitchen.error-create-failed');
      },
    });
  }

  getTableLabel(tableNumber: number): string {
    return `T-${String(tableNumber).padStart(2, '0')}`;
  }
}
