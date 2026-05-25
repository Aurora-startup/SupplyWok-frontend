import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SupplierSubscription } from '../domain/model/supplier-subscription.entity';
import { SupplierSubscriptionAssembler } from './supplier-subscription-assembler';
import { SupplierSubscriptionResource, SupplierSubscriptionsResponse } from './supplier-subscriptions-response';

export class SupplierSubscriptionsApiEndpoint extends BaseApiEndpoint<SupplierSubscription, SupplierSubscriptionResource, SupplierSubscriptionsResponse, SupplierSubscriptionAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierGetApiBaseUrl}${environment.supplierSubscriptionsEndpointPath}`, new SupplierSubscriptionAssembler());
  }
}
