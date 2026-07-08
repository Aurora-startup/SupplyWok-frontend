import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class Supplier implements BaseEntity {
  private _id: number;
  private _name: string;
  private _email: string;

  constructor(supplier: { id: number; name: string; email?: string }) {
    this._id = supplier.id;
    this._name = supplier.name;
    this._email = supplier.email ?? '';
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
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }
}
