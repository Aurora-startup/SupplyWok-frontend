import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface SupplierOrderItem {
  id: number | string | null;
  inventoryItemId: number | string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitType: string;
}

export class Order implements BaseEntity {
  private _id: number | string | null;
  private _code: string;
  private _supplierId: number | string | null;
  private _supplierName: string;
  private _restaurantName: string;
  private _orderDate: string | null;
  private _estimatedDate: string | null;
  private _priority: string;
  private _status: string;
  private _items: SupplierOrderItem[];

  constructor(order: {
    id?: number | string | null;
    code?: string;
    supplierId?: number | string | null;
    supplierName?: string;
    restaurantName?: string;
    orderDate?: string | null;
    estimatedDate?: string | null;
    priority?: string;
    status?: string;
    items?: SupplierOrderItem[];
  } = {}) {
    this._id = order.id ?? null;
    this._code = order.code ?? '';
    this._supplierId = order.supplierId ?? null;
    this._supplierName = order.supplierName ?? '';
    this._restaurantName = order.restaurantName ?? '';
    this._orderDate = order.orderDate ?? null;
    this._estimatedDate = order.estimatedDate ?? null;
    this._priority = order.priority ?? '';
    this._status = order.status ?? '';
    this._items = order.items ?? [];
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get code(): string { return this._code; }
  set code(value: string) { this._code = value; }
  get supplierId(): number | string | null { return this._supplierId; }
  set supplierId(value: number | string | null) { this._supplierId = value; }
  get supplierName(): string { return this._supplierName; }
  set supplierName(value: string) { this._supplierName = value; }
  get restaurantName(): string { return this._restaurantName; }
  set restaurantName(value: string) { this._restaurantName = value; }
  get orderDate(): string | null { return this._orderDate; }
  set orderDate(value: string | null) { this._orderDate = value; }
  get estimatedDate(): string | null { return this._estimatedDate; }
  set estimatedDate(value: string | null) { this._estimatedDate = value; }
  get priority(): string { return this._priority; }
  set priority(value: string) { this._priority = value; }
  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
  get items(): SupplierOrderItem[] { return this._items; }
  set items(value: SupplierOrderItem[]) { this._items = value; }
}
