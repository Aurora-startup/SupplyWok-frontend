import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class Supplier implements BaseEntity {
  private _id: number;
  private _name: string;

  constructor(supplier: { id: number; name: string }) {
    this._id = supplier.id;
    this._name = supplier.name;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
}
