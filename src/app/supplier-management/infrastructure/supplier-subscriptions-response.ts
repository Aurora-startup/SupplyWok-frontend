import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { SubscriptionSummaryItem, SupplierSubscriptionPlan } from '../domain/model/supplier-subscription.entity';

export interface SupplierSubscriptionResource extends BaseResource {
  currentPlan?: string;
  summary?: SubscriptionSummaryItem[];
  plans?: SupplierSubscriptionPlan[];
}

export interface SupplierSubscriptionsResponse extends BaseResponse {
  supplierSubscription?: SupplierSubscriptionResource;
  supplierSubscriptions?: SupplierSubscriptionResource[];
  'supplier-subscriptions'?: SupplierSubscriptionResource[];
}
