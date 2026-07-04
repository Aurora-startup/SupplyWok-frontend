import { BaseApi } from '../../shared/infrastructure/base-api';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryCategory} from '../domain/model/inventory-category.entity';
import { Supplier } from '../domain/model/supplier.entity';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { InventoryItemsApiEndpoint } from './inventory-items-api-endpoint';
import { CategoriesApiEndpoint } from './inventory-categories-api-endpoint';
import { SuppliersApiEndpoint} from './suppliers-api-endpoint';
import { Injectable } from '@angular/core';
import { buildCategoryId } from './inventory-item-assembler';

@Injectable({
  providedIn: 'root',
})
export class InventoryManagementApi extends BaseApi {
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
    return this.inventoryItemsEndpoint.getAll().pipe(
      map((items) =>
        items
          .map((item) => item.category)
          .filter((category): category is InventoryCategory => category !== null)
          .filter((category, index, categories) =>
            categories.findIndex((candidate) => candidate.name.toLowerCase() === category.name.toLowerCase()) === index,
          )
          .map(
            (category) =>
              new InventoryCategory({
                id: buildCategoryId(category.name),
                name: category.name,
              }),
          ),
      ),
    );
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
    return throwError(() => new Error('Category management is not supported by the backend yet'));
  }

  /**
   * Updates an existing category.
   * @param category - The category to update.
   * @returns An Observable of the updated Category object.
   */
  updateCategory(category: InventoryCategory): Observable<InventoryCategory> {
    return throwError(() => new Error('Category management is not supported by the backend yet'));
  }

  /**
   * Deletes a category by ID.
   * @param id - The ID of the category to delete.
   * @returns An Observable of void.
   */
  deleteCategory(id: number): Observable<void> {
    return throwError(() => new Error('Category management is not supported by the backend yet'));
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.suppliersEndpoint.getAll();
  }


}
