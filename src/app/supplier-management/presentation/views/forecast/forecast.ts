import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SupplierManagementStore } from '../../../application/supplier-management-store';

@Component({
  selector: 'app-forecast',
  imports: [TranslateModule, CardModule, ChartModule, TagModule],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast implements OnInit {
  readonly store = inject(SupplierManagementStore);

  readonly aggregateSeries = computed(() => this.store.demandForecast().aggregate);
  readonly clientSeries = computed(() => this.store.demandForecast().clients);
  readonly aggregateFirstValue = computed(() => this.aggregateSeries()[0]?.value ?? 0);
  readonly aggregateLastValue = computed(() => {
    const series = this.aggregateSeries();
    return series[series.length - 1]?.value ?? 0;
  });
  readonly topClientValue = computed(() => this.clientSeries().reduce((max, client) => Math.max(max, client.value), 0));

  readonly aggregateChartData = computed(() => ({
    labels: this.aggregateSeries().map((point) => point.period),
    datasets: [
      {
        data: this.aggregateSeries().map((point) => point.value),
        borderColor: '#a97827',
        backgroundColor: 'rgba(169, 120, 39, 0.18)',
        pointBackgroundColor: '#a97827',
        borderWidth: 2,
        fill: true,
        tension: 0.32
      }
    ]
  }));
  readonly clientChartData = computed(() => ({
    labels: this.clientSeries().map((client) => client.clientName),
    datasets: [
      {
        data: this.clientSeries().map((client) => client.value),
        backgroundColor: ['#c71910', '#e9bd22', '#a97827', '#25212a'],
        borderRadius: 4
      }
    ]
  }));
  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#e6ded3' }, ticks: { color: '#6f665d' } },
      y: { grid: { color: '#e6ded3' }, ticks: { color: '#6f665d' } }
    }
  };
  ngOnInit(): void {
    this.store.loadDemandForecast();
  }
}
