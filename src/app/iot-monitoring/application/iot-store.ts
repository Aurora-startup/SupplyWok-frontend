import { Injectable } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { Sensor } from '../domain/model/sensor.entity';
import { Alert } from '../domain/model/alert.entity';
import { IotMonitoringApi } from '../infrastructure/iot-monitoring-api';

@Injectable({
  providedIn: 'root',
})
export class IotStore {
  private readonly sensorsSignal = signal<Sensor[]>([]);

  readonly sensors = this.sensorsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly sensorsCount = computed(() => this.sensors().length);

  /** 
   * Dynamically derived active alerts based on current sensor states.
   * Generates Alert entities using the domain factory method.
   */
  readonly activeAlerts = computed<Alert[]>(() => {
    const alerts: Alert[] = [];
    for (const sensor of this.sensors()) {
      const alert = Alert.fromSensor(sensor);
      if (alert) {
        alerts.push(alert);
      }
    }
    // Sort by severity (Critical first) then timestamp
    return alerts.sort((a, b) => {
      if (a.severity === 'Critical' && b.severity !== 'Critical') return -1;
      if (a.severity !== 'Critical' && b.severity === 'Critical') return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  });

  /** The 3 most recent alerts, ordered purely by timestamp. Used in the main IoT Panel. */
  readonly recentAlerts = computed<Alert[]>(() => {
    const alerts = [...this.activeAlerts()];
    return alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  });

  /** The 5 most important alerts (Critical first), used in the Header popup. */
  readonly topCriticalAlerts = computed<Alert[]>(() => {
    // activeAlerts is already sorted by severity then timestamp
    return this.activeAlerts().slice(0, 5);
  });

  /** Count of storage pressure sensors with low stock */
  readonly lowStockStorageCount = computed<number>(() => {
    const storage = this.sensors().filter(s => s.type === 'storage-pressure');
    if (storage.length === 0) return 0;
    return storage.filter(s => s.lastValue <= s.minValue).length;
  });

  /** Count of temperature sensors outside the optimal range */
  readonly outOfRangeTemperatureCount = computed<number>(() => {
    const tempSensors = this.sensors().filter(
      s => s.type === 'kitchen-temperature' || s.type === 'storage-temperature'
    );
    if (tempSensors.length === 0) return 0;
    return tempSensors.filter(
      s => s.lastValue > s.maxValue || s.lastValue < s.minValue
    ).length;
  });

  /** Average kitchen temperature (null if no active sensors) */
  readonly averageKitchenTemperature = computed<number | null>(() => {
    const active = this.sensors().filter(
      s => s.type === 'kitchen-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10; // 1 decimal
  });

  /** Average storage temperature (null if no active sensors) */
  readonly averageStorageTemperature = computed<number | null>(() => {
    const active = this.sensors().filter(
      s => s.type === 'storage-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

  /** Occupied tables percentage (null if no tables registered) */
  readonly occupiedTablePercentage = computed<number | null>(() => {
    const tables = this.sensors().filter(s => s.type === 'table-pressure');
    if (tables.length === 0) return null;
    const occupied = tables.filter(s => s.lastValue > s.minValue).length;
    return Math.round((occupied / tables.length) * 100);
  });

  constructor(private iotMonitoringApi: IotMonitoringApi) {
    this.loadSensors();
  }

  getSensorById(id: number | null | undefined): Signal<Sensor | undefined> {
    return computed(() => id ? this.sensors().find(sensor => sensor.id === id) : undefined);
  }

  /**
   * Adds a new sensor to the store and persists it via the API.
   * @param sensor - the sensor to add
   */
  addSensor(sensor: Sensor): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.createSensor(sensor).pipe(retry(3)).subscribe({
      next: createdSensor => {
        this.sensorsSignal.update(sensors => [...sensors, createdSensor]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create sensor'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateSensor(updatedSensor: Sensor): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.updateSensor(updatedSensor).pipe(retry(3)).subscribe({
      next: sensor => {
        this.sensorsSignal.update(sensors =>
          sensors.map(s => s.id === sensor.id ? sensor : s)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update sensor'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteSensor(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.deleteSensor(id).pipe(retry(3)).subscribe({
      next: () => {
        this.sensorsSignal.update(sensors => sensors.filter(s => s.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete category'));
        this.loadingSignal.set(false);
      }
    })
  }

  private loadSensors(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.getSensors().pipe(takeUntilDestroyed()).subscribe({
      next: sensors => {
        this.sensorsSignal.set(sensors);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load courses'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
