import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface ForecastPoint {
  period: string;
  value: number;
}

export interface ClientForecast {
  clientId: number | string | null;
  clientName: string;
  value: number;
  trend: string;
  summary: string;
}

export class DemandForecast implements BaseEntity {
  private _id: number | string | null;
  private _aggregate: ForecastPoint[];
  private _clients: ClientForecast[];

  constructor(forecast: {
    id?: number | string | null;
    aggregate?: ForecastPoint[];
    clients?: ClientForecast[];
  } = {}) {
    this._id = forecast.id ?? null;
    this._aggregate = forecast.aggregate ?? [];
    this._clients = forecast.clients ?? [];
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get aggregate(): ForecastPoint[] { return this._aggregate; }
  set aggregate(value: ForecastPoint[]) { this._aggregate = value; }
  get clients(): ClientForecast[] { return this._clients; }
  set clients(value: ClientForecast[]) { this._clients = value; }
}
