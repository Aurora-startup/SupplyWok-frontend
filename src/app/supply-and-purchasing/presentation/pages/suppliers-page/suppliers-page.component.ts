import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryManagementStore } from '../../../../inventory-management/application/inventory-management-store';
import { Supplier } from '../../../../inventory-management/domain/model/supplier.entity';

interface SupplierDirectoryRow {
  id: number;
  name: string;
  linkedItems: number;
  categories: string[];
  lowStockItems: number;
  coverageLabel: 'healthy' | 'watch' | 'critical';
}

@Component({
  selector: 'app-suppliers-page',
  imports: [CommonModule, TranslateModule],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.css'
})
export class SuppliersPageComponent {
  private readonly inventoryStore = inject(InventoryManagementStore);
  private readonly itemsPerPage = 5;
  private readonly currentPage = signal(1);

  protected readonly supplierRows = computed<SupplierDirectoryRow[]>(() =>
    this.inventoryStore.suppliers().map((supplier) => this.buildSupplierRow(supplier))
  );

  protected readonly totalLinkedItems = computed(() =>
    this.supplierRows().reduce((sum, row) => sum + row.linkedItems, 0)
  );

  protected readonly totalLowStockItems = computed(() =>
    this.supplierRows().reduce((sum, row) => sum + row.lowStockItems, 0)
  );

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.supplierRows().length / this.itemsPerPage))
  );

  protected readonly visibleSupplierRows = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.supplierRows().slice(start, start + this.itemsPerPage);
  });

  protected readonly paginationSummary = computed(() => {
    const total = this.supplierRows().length;
    if (!total) {
      return { from: 0, to: 0, total: 0 };
    }

    const from = (this.currentPage() - 1) * this.itemsPerPage + 1;
    const to = Math.min(this.currentPage() * this.itemsPerPage, total);
    return { from, to, total };
  });

  protected readonly canGoPrevious = computed(() => this.currentPage() > 1);
  protected readonly canGoNext = computed(() => this.currentPage() < this.totalPages());

  protected goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.currentPage.update((page) => page - 1);
    }
  }

  protected goToNextPage(): void {
    if (this.canGoNext()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  private buildSupplierRow(supplier: Supplier): SupplierDirectoryRow {
    const relatedItems = this.inventoryStore.inventoryItems().filter((item) => item.idSupplier === supplier.id);
    const categories = [...new Set(
      relatedItems
        .map((item) => item.category?.name ?? this.inventoryStore.getCategoryName(item.idCategory))
        .filter((value) => Boolean(value) && value !== 'None')
    )];
    const lowStockItems = relatedItems.filter((item) => item.currentStock <= item.minimumStockLevel).length;

    return {
      id: supplier.id,
      name: supplier.name,
      linkedItems: relatedItems.length,
      categories: categories.length ? categories : ['General'],
      lowStockItems,
      coverageLabel: lowStockItems === 0 ? 'healthy' : lowStockItems >= 3 ? 'critical' : 'watch'
    };
  }
}
