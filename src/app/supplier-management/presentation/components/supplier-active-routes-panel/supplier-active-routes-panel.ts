import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

export interface SupplierRouteSummary {
  id: number | string | null;
  routeName: string;
  priority: string;
  schedule: string;
  timestamp: string;
}

@Component({
  selector: 'app-supplier-active-routes-panel',
  imports: [CardModule, TagModule],
  templateUrl: './supplier-active-routes-panel.html',
  styleUrl: './supplier-active-routes-panel.css',
})
export class SupplierActiveRoutesPanel {
  readonly title = input.required<string>();
  readonly routes = input<SupplierRouteSummary[]>([]);
  readonly emptyText = input.required<string>();
}
