import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DeliveryRoute } from '../domain/model/delivery-route.entity';
import { DeliveryRouteAssembler } from './delivery-route-assembler';
import { DeliveryRouteResource, DeliveryRoutesResponse } from './delivery-routes-response';

export class DeliveryRoutesApiEndpoint extends BaseApiEndpoint<DeliveryRoute, DeliveryRouteResource, DeliveryRoutesResponse, DeliveryRouteAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierGetApiBaseUrl}${environment.deliveryRoutesEndpointPath}`, new DeliveryRouteAssembler());
  }
}
