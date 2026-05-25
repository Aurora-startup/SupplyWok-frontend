import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { map } from 'rxjs/operators';
import { Order, SupplierOrderItem } from '../../../domain/model/order.entity';
import { SupplierManagementStore } from '../../../application/supplier-management-store';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, TranslateModule, TableModule, ButtonModule, InputTextModule, SelectModule, TagModule, DialogModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  readonly store = inject(SupplierManagementStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderId = toSignal(this.route.paramMap.pipe(map((params) => params.get('orderId'))), { initialValue: null });

  searchQuery = '';
  statusFilter = 'all';

  readonly statusOptions = [
    { labelKey: 'supplier-management.orders.filters.all', value: 'all' },
    { labelKey: 'supplier-management.orders.filters.confirmed', value: 'Confirmed' },
    { labelKey: 'supplier-management.orders.filters.pending', value: 'Pending' },
    { labelKey: 'supplier-management.orders.filters.in-transit', value: 'In Transit' },
    { labelKey: 'supplier-management.orders.filters.delivered', value: 'Delivered' },
    { labelKey: 'supplier-management.orders.filters.delayed', value: 'Delayed' }
  ];

  readonly selectedOrder = computed(() => this.store.getOrderById(this.orderId()));

  get filteredOrders(): Order[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.store.orders().filter((order) => {
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      const matchesQuery = !query || [order.code, order.restaurantName, order.supplierName, order.priority, order.status]
        .some((value) => String(value ?? '').toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }

  ngOnInit(): void {
    this.store.loadOrders();
  }

  openDetails(order: Order): void {
    void this.router.navigate(['/supplier/orders', order.id, 'view']);
  }

  closeDetails(): void {
    void this.router.navigate(['/supplier/orders']);
  }

  updateStatus(order: Order, status: string): void {
    this.store.updateOrderStatus(order, status);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (status === 'Delivered') return 'success';
    if (status === 'Delayed') return 'danger';
    if (status === 'Pending' || status === 'In Transit') return 'warn';
    return 'info';
  }

  getItemSubtotal(item: SupplierOrderItem): number {
    return Number(item.quantity) * Number(item.unitPrice);
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + this.getItemSubtotal(item), 0);
  }
}
