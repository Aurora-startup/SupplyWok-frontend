import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for a list of comandas.
 */
export interface ComandaResponse extends BaseResponse {
  comandas: ComandaResource[];
}

/**
 * Represents the API resource/DTO for a comanda item.
 */
export interface ComandaItemResource extends BaseResource {
  dishName: string;
  quantity: number;
}

/**
 * Represents the API resource/DTO for a comanda.
 */
export interface ComandaResource extends BaseResource {
  tableId: number;
  tableNumber: number;
  items: ComandaItemResource[];
  status: string;
  createdAt: string;
  updatedAt: string;
}
