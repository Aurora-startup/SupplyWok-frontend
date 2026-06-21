import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PurchaseOrderItemResource extends BaseResource {
  inventoryItemId?: number | string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitType: string;
}

export interface PurchaseOrderResource extends BaseResource {
  code?: string;
  supplierId?: number | string | null;
  supplierName?: string;
  restaurantName?: string;
  orderDate?: string | null;
  estimatedDate?: string | null;
  priority?: string;
  status?: string;
  items?: PurchaseOrderItemResource[];
}

export interface PurchaseOrderResponse extends BaseResponse {
  purchaseOrders?: PurchaseOrderResource[];
  'purchase-orders'?: PurchaseOrderResource[];
}
