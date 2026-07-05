import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
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
      `${environment.supplyWokPlatformBaseUrl}${environment.purchaseOrdersEndpointPath}`,
      new PurchaseOrderAssembler()
    );
  }

  updateStatus(id: number | string, status: string) {
    return this.http.put<PurchaseOrderResource>(`${this.endpointUrl}/${id}/status`, { status }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to update purchase order status'))
    );
  }
}
