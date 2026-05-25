import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class Client implements BaseEntity {
  private _id: number | string | null;
  private _name: string;
  private _district: string;
  private _frequency: string;
  private _averageTicket: number;
  private _demandProjectionPercent: number;
  private _status: string;
  private _lastOrderDate: string;

  constructor(client: {
    id?: number | string | null;
    name?: string;
    district?: string;
    frequency?: string;
    averageTicket?: number;
    demandProjectionPercent?: number;
    status?: string;
    lastOrderDate?: string;
  } = {}) {
    this._id = client.id ?? null;
    this._name = client.name ?? '';
    this._district = client.district ?? '';
    this._frequency = client.frequency ?? '';
    this._averageTicket = client.averageTicket ?? 0;
    this._demandProjectionPercent = client.demandProjectionPercent ?? 0;
    this._status = client.status ?? '';
    this._lastOrderDate = client.lastOrderDate ?? '';
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }
  get district(): string { return this._district; }
  set district(value: string) { this._district = value; }
  get frequency(): string { return this._frequency; }
  set frequency(value: string) { this._frequency = value; }
  get averageTicket(): number { return this._averageTicket; }
  set averageTicket(value: number) { this._averageTicket = value; }
  get demandProjectionPercent(): number { return this._demandProjectionPercent; }
  set demandProjectionPercent(value: number) { this._demandProjectionPercent = value; }
  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
  get lastOrderDate(): string { return this._lastOrderDate; }
  set lastOrderDate(value: string) { this._lastOrderDate = value; }
}
