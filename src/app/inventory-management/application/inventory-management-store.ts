import { Injectable, computed, Signal, signal } from '@angular/core';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryCategory } from '../domain/model/inventory-category.entity';
import { Supplier } from '../domain/model/supplier.entity';
import { InventoryManagementApi } from '../infrastructure/inventory-management-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryManagementStore {
  private readonly inventoryItemsSignal = signal<InventoryItem[]>([]);
  private readonly inventoryCategoriesSignal = signal<InventoryCategory[]>([]);
  private readonly suppliersSignal = signal<Supplier[]>([]);

  readonly inventoryItems = this.inventoryItemsSignal.asReadonly();
  readonly inventoryCategories = this.inventoryCategoriesSignal.asReadonly();
  readonly suppliers = this.suppliersSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly inventoryItemCount = computed(() => this.inventoryItems().length);
  readonly inventoryCategoryCount = computed(() => this.inventoryCategories().length);
  readonly suppliersCount = computed(() => this.suppliers().length);

  constructor(private inventoryManagementApi: InventoryManagementApi) {
    this.loadSuppliers();
    this.loadInventoryCategories();
    this.loadInventoryItems();
  }

  // ── Paginación ──────────────────────────────────────────────
  readonly pageSize = signal<number>(6);
  readonly currentPage = signal<number>(1);

  // ── Filters ──────────────────────────────────────────────

  readonly searchTerm = signal<string>('');

  readonly selectedCategory = signal<number | null>(null);

  readonly selectedSupplier = signal<number | null>(null);

  readonly selectedStatus = signal<string>('ALL');

  readonly filteredItems = computed(() => {
    return this.inventoryItems().filter((item) => {
      // SEARCH
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm().toLowerCase());

      // CATEGORY
      const matchesCategory =
        !this.selectedCategory() || item.idCategory === this.selectedCategory();

      // SUPPLIER
      const matchesSupplier =
        !this.selectedSupplier() || item.idSupplier === this.selectedSupplier();

      // STATUS
      const matchesStatus =
        this.selectedStatus() === 'ALL' || item.status === this.selectedStatus();

      return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
    });
  });

  readonly totalItems = computed(() => this.filteredItems().length);

  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  // Reemplaza tu inventoryItems en el template por este:
  readonly pagedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredItems().slice(start, start + this.pageSize());
  });

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  resetPage(): void {
    this.currentPage.set(1);
  }

  getCategoryName(id: number | null | undefined): string {
    if (!id) return 'None';
    return this.inventoryCategories().find((c) => c.id === id)?.name ?? 'None';
  }

  getSupplierName(id: number | null | undefined): string {
    if (!id) return 'None';
    return this.suppliers().find((s) => s.id === id)?.name ?? 'None';
  }

  getInventoryCategoryById(id: number | null | undefined): Signal<InventoryCategory | undefined> {
    return computed(() => (id ? this.inventoryCategories().find((c) => c.id === id) : undefined));
  }

  /**
   * Retrieves an inventory item by its ID as a signal.
   * @param id - The ID of the inventory item.
   * @returns A Signal containing the InventoryItem or undefined.
   */
  getInventoryItemById(id: number | null | undefined): Signal<InventoryItem | undefined> {
    return computed(() => (id ? this.inventoryItems().find((item) => item.id === id) : undefined));
  }

  /**
   * Adds a new inventory item.
   * @param inventoryItem - The inventory item to add.
   */
  addInventoryItem(inventoryItem: InventoryItem): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inventoryManagementApi
      .createInventoryItem(inventoryItem)
      .pipe(retry(2))
      .subscribe({
        next: (createdInventoryItem) => {
          this.inventoryItemsSignal.update((items) => [...items, createdInventoryItem]);

          this.loadingSignal.set(false);
        },

        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to create inventory item'));

          this.loadingSignal.set(false);
        },
      });
  }

  addInventoryCategory(inventoryCategory: InventoryCategory): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inventoryManagementApi
      .createCategory(inventoryCategory)
      .pipe(retry(2))
      .subscribe({
        next: (createdInventoryItem) => {
          this.inventoryCategoriesSignal.update((items) => [...items, createdInventoryItem]);

          this.loadingSignal.set(false);
        },

        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to create category item'));

          this.loadingSignal.set(false);
        },
      });
  }
  /**
   * Updates an existing inventory item.
   * @param updatedInventoryItem - The inventory item to update.
   */
  updateInventoryItem(updatedInventoryItem: InventoryItem): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inventoryManagementApi
      .updateInventoryItem(updatedInventoryItem)
      .pipe(retry(2))
      .subscribe({
        next: (inventoryItem) => {
          this.inventoryItemsSignal.update((items) =>
            items.map((item) => (item.id === inventoryItem.id ? inventoryItem : item)),
          );

          this.loadingSignal.set(false);
        },

        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update inventory item'));

          this.loadingSignal.set(false);
        },
      });
  }

  updateCategoryItem(updatedInventoryCategory: InventoryCategory): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inventoryManagementApi
      .updateCategory(updatedInventoryCategory)
      .pipe(retry(2))
      .subscribe({
        next: (inventoryCategory) => {
          this.inventoryCategoriesSignal.update((items) =>
            items.map((item) => (item.id === inventoryCategory.id ? inventoryCategory : item)),
          );

          this.loadingSignal.set(false);
        },

        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update inventory categories'));

          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Deletes an inventory item by ID.
   * @param id - The inventory item ID.
   */
  deleteInventoryItem(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inventoryManagementApi
      .deleteInventoryItem(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.inventoryItemsSignal.update((items) => items.filter((item) => item.id !== id));

          this.loadingSignal.set(false);
        },

        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete inventory item'));

          this.loadingSignal.set(false);
        },
      });
  }

  deleteInventoryCategory(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inventoryManagementApi
      .deleteCategory(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.inventoryCategoriesSignal.update((items) => items.filter((item) => item.id !== id));

          this.loadingSignal.set(false);
        },

        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete inventory category'));

          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all inventory items from the API.
   */
  private loadInventoryItems(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inventoryManagementApi
      .getInventoryItems()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (inventoryItems) => {
          console.log(inventoryItems);

          this.inventoryItemsSignal.set(inventoryItems);

          this.loadingSignal.set(false);
        },

        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load inventory items'));

          this.loadingSignal.set(false);
        },
      });
  }

  private loadInventoryCategories(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.inventoryManagementApi
      .getCategories()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (categories) => {
          this.inventoryCategoriesSignal.set(categories);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load inventory categories'));
          this.loadingSignal.set(false);
        },
      });
  }

  private loadSuppliers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.inventoryManagementApi
      .getSuppliers()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (suppliers) => {
          this.suppliersSignal.set(suppliers);
          this.loadingSignal.set(false);
          this.assignSuppliersToItems();
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load suppliers'));
          this.loadingSignal.set(false);
        },
      });
  }

  private assignSuppliersToItems(): void {
    this.inventoryItemsSignal.update((items) =>
      items.map((item) => this.assignSupplierToItem(item)),
    );
  }

  private assignSupplierToItem(item: InventoryItem): InventoryItem {
    const supplierId = item.idSupplier ?? 0;

    const supplier = supplierId
      ? (this.suppliers().find((s) => s.id === supplierId) ?? null)
      : null;

    return { ...item, supplier } as InventoryItem;
  }

  private assignCategoriesToItems(): void {
    this.inventoryItemsSignal.update((items) =>
      items.map((item) => this.assignCategoryToItem(item)),
    );
  }

  private assignCategoryToItem(item: InventoryItem): InventoryItem {
    const categoryId = item.idCategory ?? 0;
    const category = categoryId
      ? (this.inventoryCategories().find((cat) => cat.id === categoryId) ?? null)
      : null;
    return { ...item, category } as InventoryItem;
  }
  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }

    return fallback;
  }
}
