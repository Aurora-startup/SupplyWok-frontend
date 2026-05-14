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
  supplierId: number | string | null;
  supplierName: string;
  orderDate: string;
  priority: string;
  status: string;
  items: OrderItem[];

  constructor({
    id = null,
    supplierId = null,
    supplierName = '',
    orderDate = '',
    priority = '',
    status = '',
    items = []
  }: {
    id?: number | string | null;
    supplierId?: number | string | null;
    supplierName?: string;
    orderDate?: string;
    priority?: string;
    status?: string;
    items?: OrderItemSeed[];
  }) {
    this.id = id;
    this.supplierId = supplierId;
    this.supplierName = supplierName;
    this.orderDate = orderDate;
    this.priority = priority;
    this.status = status;
    this.items = items.map((item) => item instanceof OrderItem ? item : new OrderItem(item));
  }
}
