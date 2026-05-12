import { BaseApi } from '../../shared/infrastructure/base-api';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryCategory} from '../domain/model/inventory-category.entity';
import { Supplier } from '../domain/model/supplier.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItemsApiEndpoint } from './inventory-items-api-endpoint';
import { CategoriesApiEndpoint } from './inventory-categories-api-endpoint';
import { SuppliersApiEndpoint} from './suppliers-api-endpoint';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InventoryManagementApi extends BaseApi {
  private readonly inventoryItemsEndpoint: InventoryItemsApiEndpoint;
  private readonly inventoryCategoriesEndpoint: CategoriesApiEndpoint;
  private readonly suppliersEndpoint: SuppliersApiEndpoint;

  constructor(http: HttpClient) {
    super();
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
    return this.inventoryCategoriesEndpoint.getAll();
  }

  /**
   * Retrieves a single category by ID.
   * @param id - The ID of the category.
   * @returns An Observable of the Category object.
   */
  getCategory(id: number): Observable<InventoryCategory> {
    return this.inventoryCategoriesEndpoint.getById(id);
  }

  /**
   * Creates a new category.
   * @param category - The category to create.
   * @returns An Observable of the created Category object.
   */
  createCategory(category: InventoryCategory): Observable<InventoryCategory> {
    return this.inventoryCategoriesEndpoint.create(category);
  }

  /**
   * Updates an existing category.
   * @param category - The category to update.
   * @returns An Observable of the updated Category object.
   */
  updateCategory(category: InventoryCategory): Observable<InventoryCategory> {
    return this.inventoryCategoriesEndpoint.update(category, category.id);
  }

  /**
   * Deletes a category by ID.
   * @param id - The ID of the category to delete.
   * @returns An Observable of void.
   */
  deleteCategory(id: number): Observable<void> {
    return this.inventoryCategoriesEndpoint.delete(id);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.suppliersEndpoint.getAll();
  }


}
