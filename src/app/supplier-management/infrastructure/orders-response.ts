import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SupplierOrderItemResource extends BaseResource {
  inventoryItemId?: number | string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitType: string;
}

export interface OrderResource extends BaseResource {
  code?: string;
  supplierId?: number | string | null;
  supplierName?: string;
  restaurantName?: string;
  orderDate?: string | null;
  estimatedDate?: string | null;
  priority?: string;
  status?: string;
  items?: SupplierOrderItemResource[];
}

export interface OrdersResponse extends BaseResponse {
  purchaseOrders?: OrderResource[];
  'purchase-orders'?: OrderResource[];
}
