import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Order } from '../../../../supply-and-purchasing/domain/model/order.entity';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-supplier-orders-card',
  imports: [CurrencyPipe, DatePipe, RouterLink, TranslateModule, CardModule, TagModule],
  templateUrl: './supplier-orders-card.html',
  styleUrl: './supplier-orders-card.css',
})
export class SupplierOrdersCard {
  readonly title = input.required<string>();
  readonly caption = input.required<string>();
  readonly emptyText = input.required<string>();
  readonly orders = input<Order[]>([]);

  readonly visibleOrders = computed(() =>
    [...this.orders()]
      .sort((first, second) => this.getDateTime(second.orderDate) - this.getDateTime(first.orderDate))
      .slice(0, 4)
  );

  readonly pendingCount = computed(() => this.orders().filter((order) => order.status === 'Pending').length);
  readonly confirmedCount = computed(() => this.orders().filter((order) => order.status === 'Confirmed').length);
  readonly inTransitCount = computed(() => this.orders().filter((order) => order.status === 'In Transit').length);

  getStatusLabelKey(status: string): string {
    const normalizedStatus = status === 'In Transit'
      ? 'in-transit'
      : status.toLowerCase();
    return `supplier-management.orders.filters.${normalizedStatus}`;
  }

  getStatusSeverity(status: string): TagSeverity {
    if (status === 'Delivered') return 'success';
    if (status === 'Delayed') return 'danger';
    if (status === 'Pending' || status === 'In Transit') return 'warn';
    return 'info';
  }

  getPriorityLabelKey(priority: string): string {
    return `supplier-management.orders.priority.${priority.toLowerCase()}`;
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);
  }

  private getDateTime(value: string): number {
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? time : 0;
  }
}
