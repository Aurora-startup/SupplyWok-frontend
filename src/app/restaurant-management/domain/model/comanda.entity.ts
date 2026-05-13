import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { ComandaStatus } from '../enums/comanda-status.enum';

export class ComandaItem {
  id: number;
  dishName: string;
  quantity: number;

  constructor({
    id = 0,
    dishName = '',
    quantity = 1
  }: {
    id?: number;
    dishName?: string;
    quantity?: number;
  }) {
    this.id = id;
    this.dishName = dishName;
    this.quantity = quantity;
  }
}

export class Comanda implements BaseEntity {
  id: number | string | null;
  tableId: number;
  tableNumber: number;
  items: ComandaItem[];
  status: ComandaStatus;
  createdAt: string;
  updatedAt: string;

  constructor({
    id = null,
    tableId = 0,
    tableNumber = 0,
    items = [],
    status = ComandaStatus.EN_COLA,
    createdAt = '',
    updatedAt = ''
  }: {
    id?: number | string | null;
    tableId?: number;
    tableNumber?: number;
    items?: (ComandaItem | { id?: number; dishName?: string; quantity?: number })[];
    status?: ComandaStatus;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id = id;
    this.tableId = tableId;
    this.tableNumber = tableNumber;
    this.items = items.map((item) => item instanceof ComandaItem ? item : new ComandaItem(item));
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
