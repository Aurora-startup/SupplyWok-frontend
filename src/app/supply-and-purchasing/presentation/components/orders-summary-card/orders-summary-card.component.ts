import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrderStore } from '../../../application/purchase-order.store';

@Component({
  selector: 'app-orders-summary-card',
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './orders-summary-card.component.html',
  styleUrl: './orders-summary-card.component.css'
})
export class OrdersSummaryCardComponent implements OnInit {
  @Input() maxItems = 3;

  protected readonly store = inject(PurchaseOrderStore);

  protected readonly visiblePurchaseOrders = computed(() => {
    return [...this.store.purchaseOrders()]
      .sort((left, right) => this.toTimestamp(right.orderDate) - this.toTimestamp(left.orderDate))
      .slice(0, this.maxItems);
  });

  ngOnInit(): void {
    this.store.ensurePurchaseOrdersLoaded();
  }

  protected formatCode(id: number | string | null): string {
    return `#PO-${String(id ?? '').padStart(4, '0')}`;
  }

  protected getStatusKey(status: string): string {
    const translations: Record<string, string> = {
      'Pending': 'supply-and-purchasing.shared.status.pending',
      'In Preparation': 'supply-and-purchasing.shared.status.in-preparation',
      'Confirmed': 'supply-and-purchasing.shared.status.confirmed',
      'In Transit': 'supply-and-purchasing.shared.status.in-transit',
      'Delivered': 'supply-and-purchasing.shared.status.delivered',
      'Delayed': 'supply-and-purchasing.shared.status.delayed'
    };

    return translations[status] ?? status;
  }

  protected getStatusClass(status: string): string {
    if (status === 'Pending') return 'orders-summary-card__badge--warning';
    if (status === 'In Preparation' || status === 'Confirmed' || status === 'In Transit') return 'orders-summary-card__badge--info';
    if (status === 'Delivered') return 'orders-summary-card__badge--success';
    if (status === 'Delayed') return 'orders-summary-card__badge--danger';
    return 'orders-summary-card__badge--secondary';
  }

  protected formatOrderDate(orderDate: string): string {
    if (!orderDate) {
      return '-';
    }

    const parsedDate = new Date(orderDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return orderDate;
    }

    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(parsedDate);
  }

  private toTimestamp(orderDate: string): number {
    const parsedDate = new Date(orderDate);
    return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  }
}
