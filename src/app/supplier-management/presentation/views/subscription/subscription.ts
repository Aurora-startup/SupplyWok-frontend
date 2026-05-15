import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
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
  label: string;
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
  readonly subscription = computed(() => this.store.supplierSubscription());
  readonly activePlan = computed(() => this.subscription().plans.find((plan) => plan.isActive));
  readonly availablePlans = computed(() => this.subscription().plans.filter((plan) => !plan.isActive));
  readonly metricCards = computed<SubscriptionMetricCard[]>(() => {
    const activePlan = this.activePlan();
    const capacity = this.getPlanCapacity(activePlan);

    return [
      { label: 'CURRENT PLAN', value: activePlan?.name ?? 'Enterprise' },
      { label: 'USERS', value: capacity.users },
      { label: 'LOCATIONS', value: capacity.locations },
      { label: 'SENSORS', value: capacity.sensors }
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

  getPlanCapacitySummary(plan: SupplierSubscriptionPlan): string {
    const capacity = this.getPlanCapacity(plan);
    return `${capacity.users} users  ${capacity.locations} locations  ${capacity.sensors} sensors`;
  }
}
