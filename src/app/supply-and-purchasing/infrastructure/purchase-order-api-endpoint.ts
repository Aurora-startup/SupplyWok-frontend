import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Order } from '../domain/model/order.entity';
import { PurchaseOrderAssembler } from './purchase-order.assembler';
import { PurchaseOrderResource, PurchaseOrderResponse } from './purchase-order-response';

export class PurchaseOrderApiEndpoint extends BaseApiEndpoint<
  Order,
  PurchaseOrderResource,
  PurchaseOrderResponse,
  PurchaseOrderAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformApiBaseUrl}${environment.purchaseOrdersEndpointPath}`,
      new PurchaseOrderAssembler()
    );
  }
}
