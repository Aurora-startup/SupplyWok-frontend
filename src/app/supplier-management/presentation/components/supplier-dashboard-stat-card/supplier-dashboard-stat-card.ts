import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-supplier-dashboard-stat-card',
  imports: [CardModule, TagModule],
  templateUrl: './supplier-dashboard-stat-card.html',
  styleUrl: './supplier-dashboard-stat-card.css',
})
export class SupplierDashboardStatCard {
  readonly icon = input.required<string>();
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
  readonly badge = input<string>('');
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>('info');
}
