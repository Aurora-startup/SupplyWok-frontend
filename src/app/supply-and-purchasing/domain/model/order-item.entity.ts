import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class OrderItem implements BaseEntity {
  id: number | string | null;
  inventoryItemId: number | string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitType: string;

  constructor({
    id = null,
    inventoryItemId = null,
    productName = '',
    quantity = 0,
    unitPrice = 0,
    unitType = ''
  }: {
    id?: number | string | null;
    inventoryItemId?: number | string | null;
    productName?: string;
    quantity?: number;
    unitPrice?: number;
    unitType?: string;
  }) {
    this.id = id;
    this.inventoryItemId = inventoryItemId;
    this.productName = productName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.unitType = unitType;
  }
}
