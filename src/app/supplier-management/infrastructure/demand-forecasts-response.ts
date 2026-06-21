import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { ClientForecast, ForecastPoint } from '../../analytics/domain/model/demand-forecast.entity';

export interface DemandForecastResource extends BaseResource {
  aggregate?: ForecastPoint[];
  clients?: ClientForecast[];
}

export interface DemandForecastsResponse extends BaseResponse {
  demandForecasts?: DemandForecastResource[];
  'demand-forecasts'?: DemandForecastResource[];
}
