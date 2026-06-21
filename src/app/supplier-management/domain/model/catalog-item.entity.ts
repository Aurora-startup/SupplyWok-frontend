import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class CatalogItem implements BaseEntity {
  private _id: number | string | null;
  private _name: string;
  private _category: string;
  private _price: number;
  private _unit: string;
  private _deliveryConditions: string;

  constructor(item: {
    id?: number | string | null;
    name?: string;
    category?: string;
    price?: number;
    unit?: string;
    deliveryConditions?: string;
  } = {}) {
    this._id = item.id ?? null;
    this._name = item.name ?? '';
    this._category = item.category ?? '';
    this._price = item.price ?? 0;
    this._unit = item.unit ?? '';
    this._deliveryConditions = item.deliveryConditions ?? '';
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }
  get category(): string { return this._category; }
  set category(value: string) { this._category = value; }
  get price(): number { return this._price; }
  set price(value: number) { this._price = value; }
  get unit(): string { return this._unit; }
  set unit(value: string) { this._unit = value; }
  get deliveryConditions(): string { return this._deliveryConditions; }
  set deliveryConditions(value: string) { this._deliveryConditions = value; }
}
