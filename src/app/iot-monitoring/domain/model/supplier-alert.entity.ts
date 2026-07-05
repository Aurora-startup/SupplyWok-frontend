import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class SupplierAlert implements BaseEntity {
  private _id: number | string | null;
  private _severity: string;
  private _detail: string;
  private _date: string;
  private _status: string;

  constructor(alert: {
    id?: number | string | null;
    severity?: string;
    detail?: string;
    date?: string;
    status?: string;
  } = {}) {
    this._id = alert.id ?? null;
    this._severity = alert.severity ?? '';
    this._detail = alert.detail ?? '';
    this._date = alert.date ?? '';
    this._status = alert.status ?? '';
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get severity(): string { return this._severity; }
  set severity(value: string) { this._severity = value; }
  get detail(): string { return this._detail; }
  set detail(value: string) { this._detail = value; }
  get date(): string { return this._date; }
  set date(value: string) { this._date = value; }
  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
}
