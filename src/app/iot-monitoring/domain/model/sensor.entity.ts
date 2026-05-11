import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export class Sensor implements BaseEntity {
  private _id: number;
  private _name: string;
  private _minValue: number;
  private _maxValue: number;
  private _enabled: boolean;
  private _lastValue: number;
  private _type: string;

  constructor(sensor:
              { id: number, name: string, minValue: number, maxValue: number, enabled: boolean, lastValue: number, type: string})
  {
    this._id = sensor.id;
    this._name = sensor.name;
    this._minValue = sensor.minValue;
    this._maxValue = sensor.maxValue;
    this._enabled = sensor.enabled;
    this._lastValue = sensor.lastValue;
    this._type = sensor.type;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get minValue(): number { return this._minValue; }
  set minValue(value: number) { this._minValue = value; }

  get maxValue(): number { return this._maxValue; }
  set maxValue(value: number) { this._maxValue = value; }

  get enabled(): boolean { return this._enabled; }
  set enabled(value: boolean) { this._enabled = value; }

  get lastValue(): number { return this._lastValue; }
  set lastValue(value: number) { this._lastValue = value; }

  get type(): string { return this._type; }
  set type(value: string) { this._type = value; }
}
