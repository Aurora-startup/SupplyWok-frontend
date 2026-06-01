import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { OrderItem } from './order-item.entity';

type OrderItemSeed = OrderItem | {
  id?: number | string | null;
  inventoryItemId?: number | string | null;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  unitType?: string;
};

export class PurchaseOrder implements BaseEntity {
  id: number | string | null;
  code: string;
  supplierId: number | string | null;
  supplierName: string;
  restaurantName: string;
  orderDate: string;
  estimatedDate: string;
  priority: string;
  status: string;
  items: OrderItem[];

  constructor({
    id = null,
    code = '',
    supplierId = null,
    supplierName = '',
    restaurantName = '',
    orderDate = '',
    estimatedDate = '',
    priority = '',
    status = '',
    items = []
  }: {
    id?: number | string | null;
    code?: string;
    supplierId?: number | string | null;
    supplierName?: string;
    restaurantName?: string;
    orderDate?: string;
    estimatedDate?: string;
    priority?: string;
    status?: string;
    items?: OrderItemSeed[];
  }) {
    this.id = id;
    this.code = code;
    this.supplierId = supplierId;
    this.supplierName = supplierName;
    this.restaurantName = restaurantName;
    this.orderDate = orderDate;
    this.estimatedDate = estimatedDate;
    this.priority = priority;
    this.status = status;
    this.items = items.map((item) => item instanceof OrderItem ? item : new OrderItem(item));
  }
}
