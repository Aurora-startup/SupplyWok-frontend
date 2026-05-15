import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SupplierSubscription } from '../domain/model/supplier-subscription.entity';
import { SupplierSubscriptionResource, SupplierSubscriptionsResponse } from './supplier-subscriptions-response';

export class SupplierSubscriptionAssembler implements BaseAssembler<SupplierSubscription, SupplierSubscriptionResource, SupplierSubscriptionsResponse> {
  toEntityFromResource(resource: SupplierSubscriptionResource): SupplierSubscription {
    return new SupplierSubscription({
      id: resource.id ?? null,
      currentPlan: resource.currentPlan ?? '',
      summary: resource.summary ?? [],
      plans: (resource.plans ?? []).map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price ?? '',
        isActive: Boolean(plan.isActive),
        features: plan.features
      }))
    });
  }

  toResourceFromEntity(entity: SupplierSubscription): SupplierSubscriptionResource {
    return {
      id: entity.id,
      currentPlan: entity.currentPlan,
      summary: entity.summary,
      plans: entity.plans
    };
  }

  toEntitiesFromResponse(response: SupplierSubscriptionsResponse): SupplierSubscription[] {
    const resource = response.supplierSubscription ?? response.supplierSubscriptions?.[0] ?? response['supplier-subscriptions']?.[0];
    return resource ? [this.toEntityFromResource(resource)] : [];
  }
}
