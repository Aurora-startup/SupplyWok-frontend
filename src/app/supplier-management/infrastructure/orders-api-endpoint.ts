import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Order } from '../domain/model/order.entity';
import { OrderAssembler } from './order-assembler';
import { OrderResource, OrdersResponse } from './supplier-management-response';

export class OrdersApiEndpoint extends BaseApiEndpoint<Order, OrderResource, OrdersResponse, OrderAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierCrudApiBaseUrl}${environment.purchaseOrdersEndpointPath}`, new OrderAssembler());
  }
}
