import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface DeliveryRouteStop {
  sequence: number;
  restaurantName: string;
  district: string;
  estimatedArrival: string;
  ordersCount: number;
  orderCodes?: string[];
}

export class DeliveryRoute implements BaseEntity {
  private _id: number | string | null;
  private _date: string;
  private _routeName: string;
  private _supplierName: string;
  private _vehicle: string;
  private _status: string;
  private _totalStops: number;
  private _totalOrders: number;
  private _estimatedDeparture: string;
  private _estimatedArrival: string;
  private _estimatedDurationMinutes: number;
  private _stops: DeliveryRouteStop[];

  constructor(route: {
    id?: number | string | null;
    date?: string;
    routeName?: string;
    supplierName?: string;
    vehicle?: string;
    status?: string;
    totalStops?: number;
    totalOrders?: number;
    estimatedDeparture?: string;
    estimatedArrival?: string;
    estimatedDurationMinutes?: number;
    stops?: DeliveryRouteStop[];
  } = {}) {
    this._id = route.id ?? null;
    this._date = route.date ?? '';
    this._routeName = route.routeName ?? '';
    this._supplierName = route.supplierName ?? '';
    this._vehicle = route.vehicle ?? '';
    this._status = route.status ?? 'planned';
    this._totalStops = route.totalStops ?? 0;
    this._totalOrders = route.totalOrders ?? 0;
    this._estimatedDeparture = route.estimatedDeparture ?? '';
    this._estimatedArrival = route.estimatedArrival ?? '';
    this._estimatedDurationMinutes = route.estimatedDurationMinutes ?? 0;
    this._stops = route.stops ?? [];
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get date(): string { return this._date; }
  set date(value: string) { this._date = value; }
  get routeName(): string { return this._routeName; }
  set routeName(value: string) { this._routeName = value; }
  get supplierName(): string { return this._supplierName; }
  set supplierName(value: string) { this._supplierName = value; }
  get vehicle(): string { return this._vehicle; }
  set vehicle(value: string) { this._vehicle = value; }
  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
  get totalStops(): number { return this._totalStops; }
  set totalStops(value: number) { this._totalStops = value; }
  get totalOrders(): number { return this._totalOrders; }
  set totalOrders(value: number) { this._totalOrders = value; }
  get estimatedDeparture(): string { return this._estimatedDeparture; }
  set estimatedDeparture(value: string) { this._estimatedDeparture = value; }
  get estimatedArrival(): string { return this._estimatedArrival; }
  set estimatedArrival(value: string) { this._estimatedArrival = value; }
  get estimatedDurationMinutes(): number { return this._estimatedDurationMinutes; }
  set estimatedDurationMinutes(value: number) { this._estimatedDurationMinutes = value; }
  get stops(): DeliveryRouteStop[] { return this._stops; }
  set stops(value: DeliveryRouteStop[]) { this._stops = value; }
}
