import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { TableStatus } from '../enums/table-status.enum';
import { SensorState } from '../enums/sensor-state.enum';

export class Table implements BaseEntity {
  id: number | string | null;
  number: number;
  capacity: number;
  status: TableStatus;
  zone: string;
  dwellTime: number;
  sensorState: SensorState;

  constructor({
    id = null,
    number = 0,
    capacity = 0,
    status = TableStatus.FREE,
    zone = '',
    dwellTime = 0,
    sensorState = SensorState.IDLE
  }: {
    id?: number | string | null;
    number?: number;
    capacity?: number;
    status?: TableStatus;
    zone?: string;
    dwellTime?: number;
    sensorState?: SensorState;
  }) {
    this.id = id;
    this.number = number;
    this.capacity = capacity;
    this.status = status;
    this.zone = zone;
    this.dwellTime = dwellTime;
    this.sensorState = sensorState;
  }
}
