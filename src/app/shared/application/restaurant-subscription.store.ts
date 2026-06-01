import { Injectable, signal } from '@angular/core';

export type RestaurantPlan = 'Premium' | 'Enterprise';

@Injectable({
  providedIn: 'root'
})
export class RestaurantSubscriptionStore {
  private static readonly STORAGE_KEY = 'restaurant.subscriptionPlan';
  private readonly planSignal = signal<RestaurantPlan>(this.restorePlan());

  readonly plan = this.planSignal.asReadonly();

  setPlan(plan: RestaurantPlan): void {
    this.planSignal.set(plan);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(RestaurantSubscriptionStore.STORAGE_KEY, plan);
    }
  }

  private restorePlan(): RestaurantPlan {
    if (typeof window === 'undefined') {
      return 'Premium';
    }

    const storedPlan = window.localStorage.getItem(RestaurantSubscriptionStore.STORAGE_KEY);
    return storedPlan === 'Enterprise' ? 'Enterprise' : 'Premium';
  }
}
