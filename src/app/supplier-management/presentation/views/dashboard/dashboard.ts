import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SupplierManagementStore } from '../../../application/supplier-management-store';
import { IotStore } from '../../../../iot-monitoring/application/iot-store';
import { SupplierAggregateForecastCard } from '../../components/supplier-aggregate-forecast-card/supplier-aggregate-forecast-card';
import { SupplierDashboardStatCard } from '../../components/supplier-dashboard-stat-card/supplier-dashboard-stat-card';
import { SupplierOrdersCard } from '../../components/supplier-orders-card/supplier-orders-card';

@Component({
  selector: 'app-dashboard',
  imports: [TranslateModule, SupplierDashboardStatCard, SupplierAggregateForecastCard, SupplierOrdersCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly store = inject(SupplierManagementStore);
  readonly iotStore = inject(IotStore);

  readonly aggregateSeries = computed(() => this.store.demandForecast().aggregate);
  readonly aggregateFirstValue = computed(() => this.aggregateSeries()[0]?.value ?? 0);
  readonly aggregateLastValue = computed(() => {
    const series = this.aggregateSeries();
    return series[series.length - 1]?.value ?? 0;
  });

  ngOnInit(): void {
    this.store.loadDashboard();
    this.iotStore.loadSupplierAlerts();
  }
}
