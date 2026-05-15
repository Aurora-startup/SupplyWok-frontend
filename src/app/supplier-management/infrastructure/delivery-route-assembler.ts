import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DeliveryRoute } from '../domain/model/delivery-route.entity';
import { DeliveryRouteResource, DeliveryRoutesResponse } from './supplier-management-response';

export class DeliveryRouteAssembler extends BaseAssembler<DeliveryRoute, DeliveryRouteResource, DeliveryRoutesResponse> {
  toEntityFromResource(resource: DeliveryRouteResource): DeliveryRoute {
    return new DeliveryRoute({
      id: resource.id ?? null,
      date: resource.date ?? '',
      routeName: resource.routeName ?? '',
      supplierName: resource.supplierName ?? '',
      vehicle: resource.vehicle ?? '',
      status: resource.status ?? 'planned',
      totalStops: Number(resource.totalStops ?? 0),
      totalOrders: Number(resource.totalOrders ?? 0),
      estimatedDeparture: resource.estimatedDeparture ?? '',
      estimatedArrival: resource.estimatedArrival ?? '',
      estimatedDurationMinutes: Number(resource.estimatedDurationMinutes ?? 0),
      stops: resource.stops ?? []
    });
  }

  toResourceFromEntity(entity: DeliveryRoute): DeliveryRouteResource {
    return {
      id: entity.id,
      date: entity.date,
      routeName: entity.routeName,
      supplierName: entity.supplierName,
      vehicle: entity.vehicle,
      status: entity.status,
      totalStops: entity.totalStops,
      totalOrders: entity.totalOrders,
      estimatedDeparture: entity.estimatedDeparture,
      estimatedArrival: entity.estimatedArrival,
      estimatedDurationMinutes: entity.estimatedDurationMinutes,
      stops: entity.stops
    };
  }

  toEntitiesFromResponse(response: DeliveryRoutesResponse): DeliveryRoute[] {
    const resources = response.deliveryRoutes ?? response['delivery-routes'] ?? [];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
