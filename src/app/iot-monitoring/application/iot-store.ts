import { Injectable, DestroyRef, inject } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { Sensor } from '../domain/model/sensor.entity';
import { RestaurantAlert, RestaurantAlertSeverity } from '../domain/model/restaurant-alert.entity';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { IotMonitoringApi } from '../infrastructure/iot-monitoring-api';

@Injectable({
  providedIn: 'root',
})
export class IotStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sensorsSignal = signal<Sensor[]>([]);
  private readonly restaurantAlertHistorySignal = signal<RestaurantAlert[]>([]);
  private readonly supplierAlertsSignal = signal<SupplierAlert[]>([]);

  readonly sensors = this.sensorsSignal.asReadonly();
  readonly restaurantAlertHistory = this.restaurantAlertHistorySignal.asReadonly();
  readonly supplierAlerts = this.supplierAlertsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly sensorsCount = computed(() => this.sensors().length);

  /** List of all restaurant alerts in the history. */
  readonly allAlerts = computed(() => this.restaurantAlertHistory());

  /** 
   * List of all active (Open) restaurant alerts. 
   * Sorted by severity (Critical first) and then by timestamp (newest first).
   */
  readonly activeAlerts = computed<RestaurantAlert[]>(() => {
    const severityMap: Record<RestaurantAlertSeverity, number> = { 
      'Critical': 0, 
      'High': 1, 
      'Medium': 2, 
      'Low': 3 
    };

    return [...this.restaurantAlertHistory()]
      .filter(a => a.status === 'Open')
      .sort((a, b) => {
        const diff = severityMap[a.severity] - severityMap[b.severity];
        if (diff !== 0) return diff;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  });

  /** The 3 most recent restaurant alerts, ordered purely by timestamp. Used in the main IoT Panel. */
  readonly recentAlerts = computed<RestaurantAlert[]>(() => {
    return [...this.restaurantAlertHistory()]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  });

  /** The 5 most important restaurant alerts (Critical first), used in the Header popup. */
  readonly topCriticalAlerts = computed<RestaurantAlert[]>(() => {
    return this.activeAlerts().slice(0, 5);
  });

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

  readonly openSupplierAlertsCount = computed(() => this.supplierAlerts().filter((alert) => alert.status === 'open').length);

  constructor(private iotMonitoringApi: IotMonitoringApi) {
    this.loadRestaurantAlerts();
  }

  getSensorById(id: number | null | undefined): Signal<Sensor | undefined> {
    return computed(() => id ? this.sensors().find(sensor => sensor.id === id) : undefined);
  }

  /**
   * Marks a restaurant alert as acknowledged by calling the API and updating local state.
   */
  acknowledgeRestaurantAlert(alertId: number): void {
    const alert = this.restaurantAlertHistorySignal().find(a => a.id === alertId);
    if (alert) {
      alert.acknowledge(); // Update locally
      this.iotMonitoringApi.updateRestaurantAlert(alert).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: updatedAlert => {
          this.restaurantAlertHistorySignal.update(alerts =>
            alerts.map(a => a.id === updatedAlert.id ? updatedAlert : a)
          );
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update alert'));
        }
      });
    }
  }

  loadRestaurantAlerts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.getRestaurantAlerts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: alerts => {
        this.restaurantAlertHistorySignal.set(alerts);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load alerts'));
        this.loadingSignal.set(false);
      }
    });
  }

  loadSupplierAlerts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.getSupplierAlerts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: alerts => {
        this.supplierAlertsSignal.set(alerts);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load supplier alerts'));
        this.loadingSignal.set(false);
      }
    });
  }

  acknowledgeSupplierAlert(alert: SupplierAlert): void {
    const updatedAlert = new SupplierAlert({
      id: alert.id,
      severity: alert.severity,
      detail: alert.detail,
      date: alert.date,
      status: 'acknowledged'
    });

    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.updateSupplierAlert(updatedAlert).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (persistedAlert) => {
        this.supplierAlertsSignal.update((alerts) =>
          alerts.map((item) => item.id === persistedAlert.id ? persistedAlert : item)
        );
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to acknowledge supplier alert'));
        this.loadingSignal.set(false);
      }
    });
  }

  getSupplierAlertById(id: number | string | null | undefined): SupplierAlert | undefined {
    return this.supplierAlerts().find((alert) => String(alert.id) === String(id));
  }

  loadSensors(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iotMonitoringApi.getSensors().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: sensors => {
        this.sensorsSignal.set(sensors);
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
