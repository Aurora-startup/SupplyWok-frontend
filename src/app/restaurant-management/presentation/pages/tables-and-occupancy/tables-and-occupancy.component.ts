import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RestaurantManagementStore } from '../../../application/restaurant-management.store';
import { Table } from '../../../domain/model/table.entity';
import { TableCardComponent } from '../../components/table-card/table-card.component';
import { OccupancySummaryComponent } from '../../components/occupancy-summary/occupancy-summary.component';

@Component({
  selector: 'app-tables-and-occupancy',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TableCardComponent, OccupancySummaryComponent],
  templateUrl: './tables-and-occupancy.component.html',
  styleUrl: './tables-and-occupancy.component.css',
})
export class TablesAndOccupancyComponent implements OnInit {
  searchQuery = signal('');
  selectedZone = signal('');
  showForm = signal(false);
  editingTableId = signal<number | string | null>(null);
  formNumber = signal('');
  formCapacity = signal('');
  formError = signal('');

  filteredTables = computed(() => {
    let result = this.store.tables();
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(t =>
        this.store.getTableLabel(t).toLowerCase().includes(query)
      );
    }
    const zone = this.selectedZone();
    if (zone) {
      result = result.filter(t => t.zone === zone);
    }
    return result;
  });

  constructor(protected readonly store: RestaurantManagementStore) {
    effect(() => {
      if (this.store.tableActionCompleted()) {
        this.resetForm();
        this.showForm.set(false);
        this.editingTableId.set(null);
        this.formError.set('');
        this.store.resetTableActionCompleted();
      }

      const storeError = this.store.error();
      if (storeError === 'Failed to create table') {
        this.formError.set('restaurant-management.tables.form.errors.create-failed');
      } else if (storeError === 'Failed to update table') {
        this.formError.set('restaurant-management.tables.form.errors.update-failed');
      } else if (storeError === 'Failed to delete table') {
        this.formError.set('restaurant-management.tables.form.errors.delete-failed');
      }
    });
  }

  ngOnInit(): void {
    this.store.loadTables();
  }

  onCheckout(table: Table): void {
    this.store.checkoutTable(table);
  }

  onAssignGuest(table: Table): void {
    this.store.assignGuest(table);
  }

  onEditTable(table: Table): void {
    this.showForm.set(true);
    this.editingTableId.set(table.id);
    this.formNumber.set(String(table.number));
    this.formCapacity.set(String(table.capacity));
    this.formError.set('');
  }

  onDeleteTable(table: Table): void {
    this.formError.set('');
    this.store.deleteTable(table.id!);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onZoneChange(value: string): void {
    this.selectedZone.set(value);
  }

  openCreateForm(): void {
    this.showForm.set(true);
    this.editingTableId.set(null);
    this.formError.set('');
    this.resetForm();
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTableId.set(null);
    this.formError.set('');
    this.resetForm();
  }

  onSubmitForm(): void {
    const number = Number(this.formNumber().trim());
    const capacity = Number(this.formCapacity().trim());
    const editingId = this.editingTableId();

    if (!Number.isInteger(number) || number <= 0) {
      this.formError.set('restaurant-management.tables.form.errors.invalid-number');
      return;
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      this.formError.set('restaurant-management.tables.form.errors.invalid-capacity');
      return;
    }

    const duplicate = this.store.tables().some((table) =>
      table.number === number && String(table.id) !== String(editingId)
    );
    if (duplicate) {
      this.formError.set('restaurant-management.tables.form.errors.duplicate-number');
      return;
    }

    if (editingId != null) {
      this.store.updateTableDetails(editingId, number, capacity);
      return;
    }

    this.store.createTable(number, capacity);
  }

  onFormNumberChange(value: string): void {
    this.formNumber.set(value);
  }

  onFormCapacityChange(value: string): void {
    this.formCapacity.set(value);
  }

  private resetForm(): void {
    this.formNumber.set('');
    this.formCapacity.set('');
  }
}
