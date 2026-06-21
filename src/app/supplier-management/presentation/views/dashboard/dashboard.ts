import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SupplierManagementStore } from '../../../application/supplier-management-store';
import { SupplierActiveRoutesPanel, SupplierRouteSummary } from '../../components/supplier-active-routes-panel/supplier-active-routes-panel';
import { SupplierAggregateForecastCard } from '../../components/supplier-aggregate-forecast-card/supplier-aggregate-forecast-card';
import { SupplierDashboardStatCard } from '../../components/supplier-dashboard-stat-card/supplier-dashboard-stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [TranslateModule, SupplierDashboardStatCard, SupplierActiveRoutesPanel, SupplierAggregateForecastCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly store = inject(SupplierManagementStore);

  readonly aggregateSeries = computed(() => this.store.demandForecast().aggregate);
  readonly aggregateFirstValue = computed(() => this.aggregateSeries()[0]?.value ?? 0);
  readonly aggregateLastValue = computed(() => {
    const series = this.aggregateSeries();
    return series[series.length - 1]?.value ?? 0;
  });
  readonly activeRoutes = computed<SupplierRouteSummary[]>(() => this.store.deliveryRoutes()
    .filter((route) => ['planned', 'in-progress'].includes(route.status))
    .slice(0, 3)
    .map((route) => ({
      id: route.id,
      routeName: route.routeName,
      priorityKey: route.status === 'in-progress'
        ? 'supplier-management.dashboard.priority.high'
        : 'supplier-management.dashboard.priority.medium',
      stops: route.totalStops,
      departure: route.estimatedDeparture,
      arrival: route.estimatedArrival,
      date: route.date
    })));

  ngOnInit(): void {
    this.store.loadDashboard();
  }
}
