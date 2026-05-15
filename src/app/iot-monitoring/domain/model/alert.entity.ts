import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { Sensor } from './sensor.entity';

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Open' | 'Resolved' | 'Acknowledged';

/**
 * Domain entity representing a system alert generated from sensor data.
 * Uses translation keys to be compatible with i18n in the presentation layer.
 */
export class Alert implements BaseEntity {
  private _id: number;
  private _sensorId: number;
  private _titleKey: string;
  private _messageKey: string;
  private _messageParams: Record<string, any>;
  private _severity: AlertSeverity;
  private _status: AlertStatus;
  private _source: string;
  private _timestamp: Date;

  constructor(alert: {
    id: number;
    sensorId: number;
    titleKey: string;
    messageKey: string;
    messageParams?: Record<string, any>;
    severity: AlertSeverity;
    status: AlertStatus;
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

  get severity(): AlertSeverity { return this._severity; }
  set severity(value: AlertSeverity) { this._severity = value; }

  get status(): AlertStatus { return this._status; }
  set status(value: AlertStatus) { this._status = value; }

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

  static fromSensor(sensor: Sensor): Alert | null {
    if (!sensor.enabled) return null;

    const now = new Date();

    if (sensor.type === 'kitchen-temperature' || sensor.type === 'storage-temperature') {
      if (sensor.lastValue > sensor.maxValue || sensor.lastValue < sensor.minValue) {
        const isColdStorage = sensor.type === 'storage-temperature';
        const titleKey = isColdStorage ? 'iot.alerts.cold-storage-breach-title' : 'iot.alerts.kitchen-temp-breach-title';
        const messageKey = sensor.lastValue > sensor.maxValue ? 'iot.alerts.temp-exceeded-msg' : 'iot.alerts.temp-dropped-msg';
        
        return new Alert({
          id: parseInt(`${sensor.id}${now.getTime().toString().slice(-4)}`, 10),
          sensorId: sensor.id,
          titleKey: titleKey,
          messageKey: messageKey,
          messageParams: {
            sensorName: sensor.name,
            lastValue: sensor.lastValue,
            minValue: sensor.minValue,
            maxValue: sensor.maxValue
          },
          severity: 'Critical',
          status: 'Open',
          source: sensor.type.includes('kitchen') ? 'Kitchen' : 'Storage',
          timestamp: now
        });
      }
    }

    if (sensor.type === 'storage-pressure') {
      if (sensor.lastValue <= sensor.minValue) {
        return new Alert({
          id: parseInt(`${sensor.id}${now.getTime().toString().slice(-4)}`, 10),
          sensorId: sensor.id,
          titleKey: 'iot.alerts.low-stock-title',
          messageKey: 'iot.alerts.low-stock-msg',
          messageParams: {
            sensorName: sensor.name,
            lastValue: sensor.lastValue,
            minValue: sensor.minValue
          },
          severity: 'High',
          status: 'Open',
          source: 'Inventory',
          timestamp: now
        });
      }
    }

    if (sensor.type === 'table-pressure') {
       if (sensor.lastValue >= sensor.maxValue * 0.9 && sensor.maxValue > 0) {
          return new Alert({
            id: parseInt(`${sensor.id}${now.getTime().toString().slice(-4)}`, 10),
            sensorId: sensor.id,
            titleKey: 'iot.alerts.high-occupancy-title',
            messageKey: 'iot.alerts.high-occupancy-msg',
            messageParams: {
              sensorName: sensor.name,
              lastValue: sensor.lastValue
            },
            severity: 'Medium',
            status: 'Open',
            source: 'Dining Area',
            timestamp: now
          });
       }
    }

    return null;
  }
}
