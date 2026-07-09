import { BaseApi } from '../../shared/infrastructure/base-api';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryCategory} from '../domain/model/inventory-category.entity';
import { Supplier } from '../domain/model/supplier.entity';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, throwError } from 'rxjs';
import { InventoryItemsApiEndpoint } from './inventory-items-api-endpoint';
import { CategoriesApiEndpoint } from './inventory-categories-api-endpoint';
import { SuppliersApiEndpoint} from './suppliers-api-endpoint';
import { Injectable } from '@angular/core';
import { buildCategoryId } from './inventory-item-assembler';

@Injectable({
  providedIn: 'root',
})
export class InventoryManagementApi extends BaseApi {
  private readonly localCategoriesStorageKey = 'supply-wok.inventory.local-categories';
  private readonly defaultCategories = [
    new InventoryCategory({ id: buildCategoryId('Grains'), name: 'Grains' }),
    new InventoryCategory({ id: buildCategoryId('Proteins'), name: 'Proteins' }),
    new InventoryCategory({ id: buildCategoryId('Vegetables'), name: 'Vegetables' }),
    new InventoryCategory({ id: buildCategoryId('Sauces'), name: 'Sauces' }),
    new InventoryCategory({ id: buildCategoryId('Beverages'), name: 'Beverages' }),
    new InventoryCategory({ id: buildCategoryId('Packaging'), name: 'Packaging' }),
  ];
  private readonly inventoryItemsEndpoint: InventoryItemsApiEndpoint;
  private readonly inventoryCategoriesEndpoint: CategoriesApiEndpoint;
  private readonly suppliersEndpoint: SuppliersApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.inventoryItemsEndpoint = new InventoryItemsApiEndpoint(http);
    this.inventoryCategoriesEndpoint = new CategoriesApiEndpoint(http);
    this.suppliersEndpoint = new SuppliersApiEndpoint(http);
  }

  /**
   * Retrieves all inventory items.
   * @returns Observable of InventoryItem array.
   */
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.inventoryItemsEndpoint.getAll();
  }

  /**
   * Retrieves a single inventory item by ID.
   * @param id - Inventory item ID.
   * @returns Observable of InventoryItem.
   */
  getInventoryItem(id: number): Observable<InventoryItem> {
    return this.inventoryItemsEndpoint.getById(id);
  }

  /**
   * Creates a new inventory item.
   * @param inventoryItem - Inventory item to create.
   * @returns Observable of created InventoryItem.
   */
  createInventoryItem(inventoryItem: InventoryItem): Observable<InventoryItem> {
    return this.inventoryItemsEndpoint.create(inventoryItem);
  }

  /**
   * Updates an existing inventory item.
   * @param inventoryItem - Inventory item to update.
   * @returns Observable of updated InventoryItem.
   */
  updateInventoryItem(inventoryItem: InventoryItem): Observable<InventoryItem> {
    return this.inventoryItemsEndpoint.update(inventoryItem, inventoryItem.id);
  }

  /**
   * Deletes an inventory item by ID.
   * @param id - Inventory item ID.
   * @returns Observable<void>
   */
  deleteInventoryItem(id: number): Observable<void> {
    return this.inventoryItemsEndpoint.delete(id);
  }

  getCategories(): Observable<InventoryCategory[]> {
    return of(this.mergeCategories([...this.defaultCategories, ...this.getStoredCategories()]));
  }

  /**
   * Retrieves a single category by ID.
   * @param id - The ID of the category.
   * @returns An Observable of the Category object.
   */
  getCategory(id: number): Observable<InventoryCategory> {
    return this.getCategories().pipe(
      map((categories) => {
        const category = categories.find((item) => item.id === id);
        if (!category) {
          throw new Error('Category not found');
        }

        return category;
      }),
    );
  }

  /**
   * Creates a new category.
   * @param category - The category to create.
   * @returns An Observable of the created Category object.
   */
  createCategory(category: InventoryCategory): Observable<InventoryCategory> {
    const normalizedName = category.name.trim();

    if (!normalizedName) {
      return throwError(() => new Error('Category name is required'));
    }

    const existingCategory = this.mergeCategories([...this.defaultCategories, ...this.getStoredCategories()]).find(
      (storedCategory) => storedCategory.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (existingCategory) {
      return of(existingCategory);
    }

    const createdCategory = new InventoryCategory({
      id: category.id || buildCategoryId(normalizedName),
      name: normalizedName,
    });

    this.persistStoredCategories([...this.getStoredCategories(), createdCategory]);
    return of(createdCategory);
  }

  /**
   * Updates an existing category.
   * @param category - The category to update.
   * @returns An Observable of the updated Category object.
   */
  updateCategory(category: InventoryCategory): Observable<InventoryCategory> {
    const normalizedName = category.name.trim();

    if (!normalizedName) {
      return throwError(() => new Error('Category name is required'));
    }

    const updatedCategory = new InventoryCategory({
      id: category.id,
      name: normalizedName,
    });

    const nextCategories = this.getStoredCategories().map((storedCategory) =>
      storedCategory.id === category.id ? updatedCategory : storedCategory,
    );

    this.persistStoredCategories(nextCategories);
    return of(updatedCategory);
  }

  /**
   * Deletes a category by ID.
   * @param id - The ID of the category to delete.
   * @returns An Observable of void.
   */
  deleteCategory(id: number): Observable<void> {
    this.persistStoredCategories(this.getStoredCategories().filter((category) => category.id !== id));
    return of(void 0);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.suppliersEndpoint.getAll();
  }

  private getStoredCategories(): InventoryCategory[] {
    const storedValue = localStorage.getItem(this.localCategoriesStorageKey);

    if (!storedValue) {
      return [];
    }

    try {
      const categories = JSON.parse(storedValue) as Array<{ id: number; name: string }>;

      return categories
        .filter((category) => category && typeof category.id === 'number' && typeof category.name === 'string')
        .map((category) => new InventoryCategory(category));
    } catch {
      return [];
    }
  }

  private persistStoredCategories(categories: InventoryCategory[]): void {
    const payload = this.mergeCategories(categories).map((category) => ({
      id: category.id,
      name: category.name,
    }));

    localStorage.setItem(this.localCategoriesStorageKey, JSON.stringify(payload));
  }

  private mergeCategories(categories: InventoryCategory[]): InventoryCategory[] {
    return categories.reduce<InventoryCategory[]>((accumulator, category) => {
      const normalizedName = category.name.trim();

      if (!normalizedName) {
        return accumulator;
      }

      const alreadyExists = accumulator.some(
        (existingCategory) => existingCategory.name.trim().toLowerCase() === normalizedName.toLowerCase(),
      );

      if (alreadyExists) {
        return accumulator;
      }

      accumulator.push(
        new InventoryCategory({
          id: category.id || buildCategoryId(normalizedName),
          name: normalizedName,
        }),
      );

      return accumulator;
    }, []);
  }

}
