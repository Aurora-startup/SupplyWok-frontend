import { Injectable } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { Sensor } from '../domain/model/sensor.entity';
import { Alert, AlertSeverity } from '../domain/model/alert.entity';
import { IotMonitoringApi } from '../infrastructure/iot-monitoring-api';

@Injectable({
  providedIn: 'root',
})
export class IotStore {
  private readonly sensorsSignal = signal<Sensor[]>([]);
  private readonly alertHistorySignal = signal<Alert[]>([]);

  readonly sensors = this.sensorsSignal.asReadonly();
  readonly alertHistory = this.alertHistorySignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly sensorsCount = computed(() => this.sensors().length);

  /** List of all alerts in the history. */
  readonly allAlerts = computed(() => this.alertHistory());

  /** 
   * List of all active (Open) alerts. 
   * Sorted by severity (Critical first) and then by timestamp (newest first).
   */
  readonly activeAlerts = computed<Alert[]>(() => {
    const severityMap: Record<AlertSeverity, number> = { 
      'Critical': 0, 
      'High': 1, 
      'Medium': 2, 
      'Low': 3 
    };

    return [...this.alertHistory()]
      .filter(a => a.status === 'Open')
      .sort((a, b) => {
        const diff = severityMap[a.severity] - severityMap[b.severity];
        if (diff !== 0) return diff;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  });

  /** The 3 most recent alerts, ordered purely by timestamp. Used in the main IoT Panel. */
  readonly recentAlerts = computed<Alert[]>(() => {
    return [...this.alertHistory()]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  });

  /** The 5 most important alerts (Critical first), used in the Header popup. */
  readonly topCriticalAlerts = computed<Alert[]>(() => {
    return this.activeAlerts().slice(0, 5);
  });

  // ... (lowStockStorageCount, etc. remain the same)
  readonly lowStockStorageCount = computed<number>(() => {
    const storage = this.sensors().filter(s => s.type === 'storage-pressure');
    if (storage.length === 0) return 0;
    return storage.filter(s => s.lastValue <= s.minValue).length;
  });

  readonly outOfRangeTemperatureCount = computed<number>(() => {
    const tempSensors = this.sensors().filter(
      s => s.type === 'kitchen-temperature' || s.type === 'storage-temperature'
    );
    if (tempSensors.length === 0) return 0;
    return tempSensors.filter(
      s => s.lastValue > s.maxValue || s.lastValue < s.minValue
    ).length;
  });

  readonly averageKitchenTemperature = computed<number | null>(() => {
    const active = this.sensors().filter(
      s => s.type === 'kitchen-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

  readonly averageStorageTemperature = computed<number | null>(() => {
    const active = this.sensors().filter(
      s => s.type === 'storage-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

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
   * Synchronizes alerts based on current sensor values.
   */
  syncAlerts(): void {
    const currentHistory = [...this.alertHistorySignal()];
    let updated = false;

    for (const sensor of this.sensorsSignal()) {
      const newAlert = Alert.fromSensor(sensor);
      const existingAlert = currentHistory.find(a => a.sensorId === sensor.id && a.status === 'Open');

      if (newAlert && !existingAlert) {
        currentHistory.unshift(newAlert);
        updated = true;
      } else if (!newAlert && existingAlert) {
        existingAlert.resolve();
        updated = true;
      }
    }

    if (updated) {
      this.alertHistorySignal.set(currentHistory);
    }
  }

  /**
   * Marks an alert as acknowledged.
   */
  acknowledgeAlert(alertId: number): void {
    const currentHistory = [...this.alertHistorySignal()];
    const alert = currentHistory.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledge();
      this.alertHistorySignal.set(currentHistory);
    }
  }

  loadSensors(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.getSensors().pipe(takeUntilDestroyed()).subscribe({
      next: sensors => {
        this.sensorsSignal.set(sensors);
        this.syncAlerts();
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load sensors'));
        this.loadingSignal.set(false);
      }
    });
  }

  addSensor(sensor: Sensor): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.createSensor(sensor).pipe(retry(3)).subscribe({
      next: createdSensor => {
        this.sensorsSignal.update(sensors => [...sensors, createdSensor]);
        this.syncAlerts();
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
        this.syncAlerts();
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
        this.syncAlerts();
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete sensor'));
        this.loadingSignal.set(false);
      }
    })
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
