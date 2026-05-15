import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SupplierManagementStore } from '../../../application/supplier-management-store';
import { SupplierSubscriptionPlan } from '../../../domain/model/supplier-subscription.entity';

interface PlanCapacity {
  users: number;
  locations: number;
  sensors: number;
}

interface SubscriptionMetricCard {
  labelKey: string;
  value: string | number;
}

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, TranslateModule, CardModule, TagModule, ButtonModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription implements OnInit {
  readonly store = inject(SupplierManagementStore);
  readonly translate = inject(TranslateService);
  readonly subscription = computed(() => this.store.supplierSubscription());
  readonly activePlan = computed(() => this.subscription().plans.find((plan) => plan.isActive));
  readonly availablePlans = computed(() => this.subscription().plans.filter((plan) => !plan.isActive));
  readonly metricCards = computed<SubscriptionMetricCard[]>(() => {
    const activePlan = this.activePlan();
    const capacity = this.getPlanCapacity(activePlan);

    return [
      {
        labelKey: 'shared.subscriptionPage.summary.currentPlan',
        value: activePlan?.name ?? this.subscription().currentPlan ?? 'Enterprise'
      },
      { labelKey: 'shared.subscriptionPage.summary.users', value: capacity.users },
      { labelKey: 'shared.subscriptionPage.summary.locations', value: capacity.locations },
      { labelKey: 'shared.subscriptionPage.summary.sensors', value: capacity.sensors }
    ];
  });

  ngOnInit(): void {
    this.store.loadSupplierSubscription();
  }

  getPlanCapacity(plan: SupplierSubscriptionPlan | undefined): PlanCapacity {
    if (plan?.id === 'premium') {
      return { users: 8, locations: 1, sensors: 12 };
    }

    return { users: 20, locations: 4, sensors: 40 };
  }

  getPlanName(plan: SupplierSubscriptionPlan): string {
    const key = `supplier-management.subscription.plans.${plan.id}.name`;
    const translated = this.translate.instant(key);
    return translated !== key ? translated : plan.name;
  }

  getPlanFeatures(plan: SupplierSubscriptionPlan): string[] {
    const key = `shared.subscriptionPage.plans.${plan.id}.features`;
    const translated = this.translate.instant(key);
    return Array.isArray(translated) && translated.length ? translated : plan.features;
  }
}
