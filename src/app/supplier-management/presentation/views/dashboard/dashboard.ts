import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  private readonly translate = inject(TranslateService);

  readonly aggregateSeries = computed(() => this.store.demandForecast().aggregate);
  readonly aggregateSummary = computed(() => {
    const series = this.aggregateSeries();
    const first = series[0]?.value ?? 0;
    const last = series[series.length - 1]?.value ?? 0;
    return this.translate.instant('supplier-management.dashboard.aggregate.summary', { from: first, to: last });
  });
  readonly activeRoutes = computed<SupplierRouteSummary[]>(() => this.store.deliveryRoutes()
    .filter((route) => ['planned', 'in-progress'].includes(route.status))
    .slice(0, 3)
    .map((route) => ({
      id: route.id,
      routeName: route.routeName,
      priority: route.status === 'in-progress'
        ? this.translate.instant('supplier-management.dashboard.priority.high')
        : this.translate.instant('supplier-management.dashboard.priority.medium'),
      schedule: this.translate.instant('supplier-management.dashboard.routes.schedule', {
        stops: route.totalStops,
        departure: route.estimatedDeparture,
        arrival: route.estimatedArrival
      }),
      timestamp: this.translate.instant('supplier-management.dashboard.routes.date', { date: route.date })
    })));

  ngOnInit(): void {
    this.store.loadDashboard();
  }
}
