export type TableStatus = 'OCCUPIED' | 'FREE' | 'RESERVED' | 'CLEANING';
export type SensorState = 'active' | 'idle';

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: TableStatus;
  zone: string;
  dwellTime: number;
  sensorState: SensorState;
}
