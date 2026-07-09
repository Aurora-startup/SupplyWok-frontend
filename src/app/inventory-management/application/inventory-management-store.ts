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
  private readonly defaultCategoryTranslationKeys: Record<string, string> = {
    grains: 'inventory.categories.grains',
    proteins: 'inventory.categories.proteins',
    vegetables: 'inventory.categories.vegetables',
    sauces: 'inventory.categories.sauces',
    beverages: 'inventory.categories.beverages',
    packaging: 'inventory.categories.packaging',
  };

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

  private readonly itemSavedSignal = signal(false);
  readonly itemSaved = this.itemSavedSignal.asReadonly();

  resetItemSaved(): void {
    this.itemSavedSignal.set(false);
  }

  readonly inventoryItemCount = computed(() => this.inventoryItems().length);
  readonly inventoryCategoryCount = computed(() => this.inventoryCategories().length);
  readonly suppliersCount = computed(() => this.suppliers().length);

  constructor(private inventoryManagementApi: InventoryManagementApi) {
    this.loadSuppliers();
    this.loadInventoryCategories();
    this.loadInventoryItems();
  }

  // ── Paginación ──────────────────────────────────────────────
  readonly pageSize = signal<number>(4);
  readonly currentPage = signal<number>(1);

  // ── Filters ──────────────────────────────────────────────

  readonly searchTerm = signal<string>('');

  readonly selectedCategory = signal<number | null>(null);

  readonly selectedStatus = signal<string>('ALL');

  readonly filteredItems = computed(() => {
    return this.inventoryItems().filter((item) => {
      // SEARCH
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm().toLowerCase());

      // CATEGORY
      const matchesCategory =
        !this.selectedCategory() || item.idCategory === this.selectedCategory();

      // STATUS
      const matchesStatus =
        this.selectedStatus() === 'ALL' || item.status === this.selectedStatus();

      return matchesSearch && matchesCategory && matchesStatus;
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

  getCategoryById(id: number | null | undefined): InventoryCategory | null {
    if (!id) return null;
    return this.inventoryCategories().find((category) => category.id === id) ?? null;
  }

  getCategoryTranslationKey(category: InventoryCategory | null | undefined): string | null {
    const normalizedName = category?.name.trim().toLowerCase();
    return normalizedName ? (this.defaultCategoryTranslationKeys[normalizedName] ?? null) : null;
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
    this.itemSavedSignal.set(false);

    this.inventoryManagementApi
      .createInventoryItem(inventoryItem)
      .pipe(retry(2))
      .subscribe({
        next: (createdInventoryItem) => {
          const normalizedItem = this.mergeResolvedItem(createdInventoryItem, inventoryItem);
          this.inventoryItemsSignal.update((items) => [...items, normalizedItem]);
          this.syncCategoriesFromItems(this.inventoryItemsSignal());
          this.loadingSignal.set(false);
          this.itemSavedSignal.set(true);
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
          this.inventoryCategoriesSignal.update((items) => this.mergeCategories([...items, createdInventoryItem]));

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
    this.itemSavedSignal.set(false);

    this.inventoryManagementApi
      .updateInventoryItem(updatedInventoryItem)
      .pipe(retry(2))
      .subscribe({
        next: (inventoryItem) => {
          const normalizedItem = this.mergeResolvedItem(inventoryItem, updatedInventoryItem);
          this.inventoryItemsSignal.update((items) =>
            items.map((item) => (item.id === normalizedItem.id ? normalizedItem : item)),
          );
          this.syncCategoriesFromItems(this.inventoryItemsSignal());
          this.loadingSignal.set(false);
          this.itemSavedSignal.set(true);
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
          this.syncCategoriesFromItems(this.inventoryItemsSignal());

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
          this.inventoryItemsSignal.set(inventoryItems);
          this.syncCategoriesFromItems(inventoryItems);
          this.assignCategoriesToItems();

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
          this.assignCategoriesToItems();
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load inventory categories'));
          this.loadingSignal.set(false);
        },
      });
  }

  refreshSuppliers(): void {
    this.inventoryManagementApi
      .getSuppliers()
      .subscribe({
        next: (suppliers) => {
          this.suppliersSignal.set(suppliers);
        },
        error: () => {
          this.suppliersSignal.set([]);
        },
      });
  }

  private loadSuppliers(): void {
    this.refreshSuppliers();
  }

  private assignCategoriesToItems(): void {
    this.inventoryItemsSignal.update((items) =>
      items.map((item) => this.assignCategoryToItem(item)),
    );
  }

  private syncCategoriesFromItems(items: InventoryItem[]): void {
    const existingCategories = this.inventoryCategories();
    const categoriesFromItems = items
      .map((item) => item.category)
      .filter((category): category is InventoryCategory => category !== null);

    const mergedCategories = [...existingCategories];

    for (const category of categoriesFromItems) {
      const alreadyExists = mergedCategories.some(
        (existingCategory) => existingCategory.name.trim().toLowerCase() === category.name.trim().toLowerCase(),
      );

      if (!alreadyExists) {
        mergedCategories.push(category);
      }
    }

    this.inventoryCategoriesSignal.set(this.mergeCategories(mergedCategories));
  }

  private mergeCategories(categories: InventoryCategory[]): InventoryCategory[] {
    return categories.reduce<InventoryCategory[]>((mergedCategories, category) => {
      const normalizedName = category.name.trim();

      if (!normalizedName) {
        return mergedCategories;
      }

      const alreadyExists = mergedCategories.some(
        (existingCategory) => existingCategory.name.trim().toLowerCase() === normalizedName.toLowerCase(),
      );

      if (!alreadyExists) {
        mergedCategories.push(category);
      }

      return mergedCategories;
    }, []);
  }

  private assignCategoryToItem(item: InventoryItem): InventoryItem {
    const categoryId = item.idCategory ?? 0;
    const category = categoryId
      ? (this.inventoryCategories().find((cat) => cat.id === categoryId) ?? null)
      : null;
    return this.cloneItemWithCategory(item, category);
  }

  private mergeResolvedItem(itemFromApi: InventoryItem, fallbackItem: InventoryItem): InventoryItem {
    const resolvedCategory = itemFromApi.category ?? fallbackItem.category ?? null;

    return this.cloneItemWithCategory(
      new InventoryItem({
        id: itemFromApi.id,
        name: itemFromApi.name,
        currentStock: itemFromApi.currentStock,
        minimumStockLevel: itemFromApi.minimumStockLevel,
        unitOfMeasure: itemFromApi.unitOfMeasure,
        idCategory: itemFromApi.idCategory || fallbackItem.idCategory,
        idSupplier: 0,
        category: resolvedCategory,
      }),
      resolvedCategory,
    );
  }

  private cloneItemWithCategory(
    item: InventoryItem,
    category: InventoryCategory | null,
  ): InventoryItem {
    return new InventoryItem({
      id: item.id,
      name: item.name,
      currentStock: item.currentStock,
      minimumStockLevel: item.minimumStockLevel,
      unitOfMeasure: item.unitOfMeasure,
      idCategory: item.idCategory,
      idSupplier: 0,
      category,
    });
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
