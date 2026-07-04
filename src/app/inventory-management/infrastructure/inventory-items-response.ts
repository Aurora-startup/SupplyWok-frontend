import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for a list of categories.
 */
export interface InventoryItemsResponse extends BaseResponse {
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
  unitOfMeasure: string | null;
  category?: string | null;
  idCategory?: number;
  idSupplier?: number;
}
