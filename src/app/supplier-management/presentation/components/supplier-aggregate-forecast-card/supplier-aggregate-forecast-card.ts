import { Component, computed, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ForecastPoint } from '../../../domain/model/demand-forecast.entity';

@Component({
  selector: 'app-supplier-aggregate-forecast-card',
  imports: [CardModule, ChartModule],
  templateUrl: './supplier-aggregate-forecast-card.html',
  styleUrl: './supplier-aggregate-forecast-card.css',
})
export class SupplierAggregateForecastCard {
  readonly title = input.required<string>();
  readonly summary = input.required<string>();
  readonly series = input<ForecastPoint[]>([]);
  readonly emptyText = input.required<string>();

  readonly chartData = computed(() => ({
    labels: this.series().map((point) => point.period),
    datasets: [
      {
        data: this.series().map((point) => point.value),
        borderColor: '#a97827',
        backgroundColor: 'rgba(169, 120, 39, 0.18)',
        pointBackgroundColor: '#a97827',
        pointBorderColor: '#a97827',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.32
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
}
