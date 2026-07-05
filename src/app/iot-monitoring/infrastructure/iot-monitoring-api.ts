import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorApiEndpoint } from './sensor-api-endpoint';
import { RestaurantAlertsApiEndpoint } from './restaurant-alerts-api-endpoint';
import { RestaurantAlert } from '../domain/model/restaurant-alert.entity';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierAlertsApiEndpoint } from './supplier-alerts-api-endpoint';

/**
 * Facade class for IoT Monitoring and Sensor operations.
 * Centralizes access to sensor data and provides semantic methods for specific sensor types.
 */
@Injectable({
  providedIn: 'root',
})
export class IotMonitoringApi extends BaseApi {
  private readonly sensorApiEndpoint: SensorApiEndpoint;
  private readonly restaurantAlertsApiEndpoint: RestaurantAlertsApiEndpoint;
  private readonly supplierAlertsApiEndpoint: SupplierAlertsApiEndpoint;

  /**
   * Initializes the API facade.
   * @param http The Angular HttpClient instance.
   */
  constructor(http: HttpClient) {
    super(http);
    this.sensorApiEndpoint = new SensorApiEndpoint(http);
    this.restaurantAlertsApiEndpoint = new RestaurantAlertsApiEndpoint(http);
    this.supplierAlertsApiEndpoint = new SupplierAlertsApiEndpoint(http);
  }

  /**
   * Retrieves all sensors regardless of type.
   * @returns An Observable of Sensor array.
   */
  getSensors(): Observable<Sensor[]> {
    return this.sensorApiEndpoint.getAll();
  }

  /**
   * Internal helper to filter sensors by their specific category type.
   * @param type The hyphenated string identifier for the sensor type.
   * @returns An Observable of the filtered Sensor array.
   */
  private getSensorsByType(type: string): Observable<Sensor[]> {
    return this.getSensors().pipe(
      map(sensors => sensors.filter(sensor => sensor.type === type))
    );
  }

  /**
   * Specifically retrieves sensors located in the kitchen for temperature monitoring.
   * @returns Observable of kitchen temperature sensors.
   */
  getKitchenTemperatureSensors(): Observable<Sensor[]> {
    return this.getSensorsByType('kitchen-temperature');
  }

  /**
   * Specifically retrieves sensors located in storage areas for temperature monitoring.
   * @returns Observable of storage temperature sensors.
   */
  getStorageTemperatureSensors(): Observable<Sensor[]> {
    return this.getSensorsByType('storage-temperature');
  }

  /**
   * Specifically retrieves pressure sensors associated with dining tables.
   * @returns Observable of table pressure sensors.
   */
  getTablePressureSensors(): Observable<Sensor[]> {
    return this.getSensorsByType('table-pressure');
  }

  /**
   * Specifically retrieves pressure sensors associated with storage inventory weight/load.
   * @returns Observable of storage pressure sensors.
   */
  getStoragePressureSensors(): Observable<Sensor[]> {
    return this.getSensorsByType('storage-pressure');
  }

  /**
   * Retrieves a single sensor by its unique identifier.
   * @param id The unique ID of the sensor.
   * @returns Observable of the requested Sensor.
   */
  getSensor(id: number): Observable<Sensor> {
    return this.sensorApiEndpoint.getById(id);
  }

  /**
   * Registers a new sensor in the system.
   * @param sensor The Sensor data to persist.
   * @returns Observable of the created Sensor.
   */
  createSensor(sensor: Sensor): Observable<Sensor> {
    return this.sensorApiEndpoint.create(sensor);
  }

  /**
   * Removes a sensor from the system.
   * @param id The unique ID of the sensor to remove.
   * @returns Observable indicating completion.
   */
  deleteSensor(id: number): Observable<void> {
    return this.sensorApiEndpoint.delete(id);
  }

  /**
   * Updates an existing sensor's information.
   * @param sensor The Sensor with updated values.
   * @returns Observable of the updated Sensor.
   */
  updateSensor(sensor: Sensor): Observable<Sensor> {
    return this.sensorApiEndpoint.update(sensor, sensor.id);
  }

  /**
   * Retrieves all restaurant alerts.
   * @returns An Observable of RestaurantAlert array.
   */
  getRestaurantAlerts(): Observable<RestaurantAlert[]> {
    return this.restaurantAlertsApiEndpoint.getAll();
  }

  /**
   * Updates an existing restaurant alert's information.
   * @param alert The RestaurantAlert with updated values.
   * @returns Observable of the updated RestaurantAlert.
   */
  updateRestaurantAlert(alert: RestaurantAlert): Observable<RestaurantAlert> {
    return this.restaurantAlertsApiEndpoint.update(alert, alert.id);
  }

  /**
   * Retrieves all supplier alerts.
   * @returns An Observable of SupplierAlert array.
   */
  getSupplierAlerts(): Observable<SupplierAlert[]> {
    return this.supplierAlertsApiEndpoint.getAll();
  }

  /**
   * Updates an existing supplier alert's information.
   * @param alert The SupplierAlert with updated values.
   * @returns Observable of the updated SupplierAlert.
   */
  updateSupplierAlert(alert: SupplierAlert): Observable<SupplierAlert> {
    return this.supplierAlertsApiEndpoint.update(alert, String(alert.id));
  }
}
