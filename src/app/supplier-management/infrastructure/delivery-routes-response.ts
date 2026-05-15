import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { DeliveryRouteStop } from '../domain/model/delivery-route.entity';

export interface DeliveryRouteResource extends BaseResource {
  date?: string;
  routeName?: string;
  supplierName?: string;
  vehicle?: string;
  status?: string;
  totalStops?: number;
  totalOrders?: number;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  estimatedDurationMinutes?: number;
  stops?: DeliveryRouteStop[];
}

export interface DeliveryRoutesResponse extends BaseResponse {
  deliveryRoutes?: DeliveryRouteResource[];
  'delivery-routes'?: DeliveryRouteResource[];
}
