import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SupplierManagementStore } from '../../../application/supplier-management-store';
interface SubscriptionMetricCard {
  labelKey: string;
  value: string | number;
  valueKey?: string | null;
}

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, TranslateModule, CardModule, TagModule, ButtonModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription implements OnInit {
  readonly store = inject(SupplierManagementStore);
  readonly subscription = computed(() => this.store.supplierSubscription());
  readonly activePlan = computed(() => this.subscription().plans.find((plan) => plan.isActive));
  readonly availablePlans = computed(() => this.subscription().plans.filter((plan) => !plan.isActive));
  readonly metricCards = computed<SubscriptionMetricCard[]>(() => {
    const activePlan = this.activePlan();
    const users = activePlan?.id === 'premium' ? 8 : 20;
    const locations = activePlan?.id === 'premium' ? 1 : 4;
    const sensors = activePlan?.id === 'premium' ? 12 : 40;

    return [
      {
        labelKey: 'shared.subscriptionPage.summary.currentPlan',
        valueKey: activePlan ? `supplier-management.subscription.plans.${activePlan.id}.name` : null,
        value: this.subscription().currentPlan ?? 'Enterprise'
      },
      { labelKey: 'shared.subscriptionPage.summary.users', value: users },
      { labelKey: 'shared.subscriptionPage.summary.locations', value: locations },
      { labelKey: 'shared.subscriptionPage.summary.sensors', value: sensors }
    ];
  });

  ngOnInit(): void {
    this.store.loadSupplierSubscription();
  }

}
