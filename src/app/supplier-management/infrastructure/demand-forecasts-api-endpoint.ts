import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DemandForecast } from '../../analytics/domain/model/demand-forecast.entity';
import { DemandForecastAssembler } from './demand-forecast-assembler';
import { DemandForecastResource, DemandForecastsResponse } from './demand-forecasts-response';

export class DemandForecastsApiEndpoint extends BaseApiEndpoint<DemandForecast, DemandForecastResource, DemandForecastsResponse, DemandForecastAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierGetApiBaseUrl}${environment.demandForecastsEndpointPath}`, new DemandForecastAssembler());
  }
}
