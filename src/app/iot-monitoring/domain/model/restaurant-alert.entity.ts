import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export type RestaurantAlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type RestaurantAlertStatus = 'Open' | 'Resolved' | 'Acknowledged';

/**
 * Domain entity representing a system alert generated from sensor data.
 * Uses translation keys to be compatible with i18n in the presentation layer.
 */
export class RestaurantAlert implements BaseEntity {
  private _id: number;
  private _sensorId: number;
  private _titleKey: string;
  private _messageKey: string;
  private _messageParams: Record<string, any>;
  private _severity: RestaurantAlertSeverity;
  private _status: RestaurantAlertStatus;
  private _source: string;
  private _timestamp: Date;

  constructor(alert: {
    id: number;
    sensorId: number;
    titleKey: string;
    messageKey: string;
    messageParams?: Record<string, any>;
    severity: RestaurantAlertSeverity;
    status: RestaurantAlertStatus;
    source: string;
    timestamp: Date;
  }) {
    this._id = alert.id;
    this._sensorId = alert.sensorId;
    this._titleKey = alert.titleKey;
    this._messageKey = alert.messageKey;
    this._messageParams = alert.messageParams || {};
    this._severity = alert.severity;
    this._status = alert.status;
    this._source = alert.source;
    this._timestamp = alert.timestamp;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get sensorId(): number { return this._sensorId; }
  set sensorId(value: number) { this._sensorId = value; }

  get titleKey(): string { return this._titleKey; }
  get messageKey(): string { return this._messageKey; }
  get messageParams(): Record<string, any> { return this._messageParams; }

  get title(): string { return this._titleKey; }
  get message(): string { return this._messageKey; }

  get severity(): RestaurantAlertSeverity { return this._severity; }
  set severity(value: RestaurantAlertSeverity) { this._severity = value; }

  get status(): RestaurantAlertStatus { return this._status; }
  set status(value: RestaurantAlertStatus) { this._status = value; }

  get source(): string { return this._source; }
  set source(value: string) { this._source = value; }

  get timestamp(): Date { return this._timestamp; }
  set timestamp(value: Date) { this._timestamp = value; }

  /**
   * Marks the alert as resolved.
   */
  resolve(): void {
    this._status = 'Resolved';
  }

  /**
   * Marks the alert as acknowledged.
   */
  acknowledge(): void {
    this._status = 'Acknowledged';
  }
}
