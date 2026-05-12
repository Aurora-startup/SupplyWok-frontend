import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RestaurantManagementStore } from '../../../application/restaurant-management.store';
import { Comanda, ComandaItem } from '../../../domain/model/comanda.entity';
import { ComandaCardComponent } from '../../components/comanda-card/comanda-card.component';

@Component({
  selector: 'app-kitchen-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ComandaCardComponent],
  templateUrl: './kitchen-tickets.component.html',
  styleUrl: './kitchen-tickets.component.css',
})
export class KitchenTicketsComponent implements OnInit {
  statusFilter = signal<string>('');
  showCreateForm = signal(false);
  newComandaTableId = signal<number | null>(null);
  newComandaItems = signal<Partial<ComandaItem>[]>([{ dishName: '', quantity: 1 }]);
  createError = signal('');

  constructor(protected store: RestaurantManagementStore) {}

  ngOnInit(): void {
    this.store.loadComandas();
    this.store.loadTables();
  }

  get filteredComandas(): Comanda[] {
    const filter = this.statusFilter();
    if (!filter) return this.store.comandas();
    return this.store.comandas().filter(c => c.status === filter);
  }

  advanceStatus(comanda: Comanda): void {
    this.store.advanceComandaStatus(comanda);
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
    const result = this.store.createComanda(tableId!, this.newComandaItems());
    if (!result.success) {
      this.createError.set(result.errorKey!);
      return;
    }
    this.toggleCreateForm();
  }
}
