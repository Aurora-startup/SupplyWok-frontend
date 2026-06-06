import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DemandForecast } from '../../analytics/domain/model/demand-forecast.entity';
import { DemandForecastResource, DemandForecastsResponse } from './demand-forecasts-response';

export class DemandForecastAssembler implements BaseAssembler<DemandForecast, DemandForecastResource, DemandForecastsResponse> {
  toEntityFromResource(resource: DemandForecastResource): DemandForecast {
    return new DemandForecast({
      id: resource.id ?? null,
      aggregate: resource.aggregate ?? [],
      clients: resource.clients ?? []
    });
  }

  toResourceFromEntity(entity: DemandForecast): DemandForecastResource {
    return {
      id: entity.id,
      aggregate: entity.aggregate,
      clients: entity.clients
    };
  }

  toEntitiesFromResponse(response: DemandForecastsResponse): DemandForecast[] {
    const resources = response.demandForecasts ?? response['demand-forecasts'] ?? [];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
