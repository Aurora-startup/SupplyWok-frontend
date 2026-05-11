import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Sensor} from '../domain/model/sensor.entity';
import {SensorResource, SensorResponse} from './sensor-response';
import {SensorAssembler} from './sensor-assembler';

/**
 * Concrete implementation of the API endpoint for SensorEntity resources.
 * Handles the communication with the backend service using the BaseApiEndpoint's CRUD logic.
 */
export class SensorApiEndpoint extends BaseApiEndpoint<Sensor, SensorResource, SensorResponse, SensorAssembler> {
  /**
   * Constructs the endpoint with the necessary dependencies.
   * @param http The Angular HttpClient instance.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderSensorsEndpointPath}`, new SensorAssembler());
  }
}
