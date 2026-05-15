import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for a list of categories.
 */
export interface InventoryItemsResponse extends BaseResponse {
  /**
   * The list of categories returned by the API.
   */
  inventoryItems: ItemResource[];
}

/**
 * Represents the API resource/DTO for a category.
 */
export interface ItemResource extends BaseResource {
  id: number;
  name: string;
  currentStock: number;
  minimumStockLevel: number;
  unitOfMeasure: string;
  idCategory: number;
  idSupplier: number;
}
