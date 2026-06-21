import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { SupplierManagementStore } from '../../../application/supplier-management-store';

@Component({
  selector: 'app-delivery',
  imports: [FormsModule, TranslateModule, CardModule, SelectModule, TagModule],
  templateUrl: './delivery.html',
  styleUrl: './delivery.css',
})
export class Delivery implements OnInit {
  readonly store = inject(SupplierManagementStore);
  dateFilter = 'all';
  statusFilter = 'all';

  readonly dateOptions = computed(() => [
    { labelKey: 'supplier-management.delivery.filters.all-dates', value: 'all' },
    ...Array.from(new Set(this.store.deliveryRoutes().map((route) => route.date))).map((date) => ({ label: date, value: date }))
  ]);
  readonly statusOptions = [
    { labelKey: 'supplier-management.delivery.filters.all-statuses', value: 'all' },
    { labelKey: 'supplier-management.delivery.status.planned', value: 'planned' },
    { labelKey: 'supplier-management.delivery.status.in-progress', value: 'in-progress' },
    { labelKey: 'supplier-management.delivery.status.completed', value: 'completed' }
  ];
  readonly routeSummary = computed(() => ({
    totalRoutes: this.filteredRoutes.length,
    totalStops: this.filteredRoutes.reduce((sum, route) => sum + route.totalStops, 0),
    totalOrders: this.filteredRoutes.reduce((sum, route) => sum + route.totalOrders, 0)
  }));

  get filteredRoutes() {
    return this.store.deliveryRoutes().filter((route) => {
      const matchesDate = this.dateFilter === 'all' || route.date === this.dateFilter;
      const matchesStatus = this.statusFilter === 'all' || route.status === this.statusFilter;
      return matchesDate && matchesStatus;
    });
  }

  ngOnInit(): void {
    this.store.loadDeliveryRoutes();
  }
}
