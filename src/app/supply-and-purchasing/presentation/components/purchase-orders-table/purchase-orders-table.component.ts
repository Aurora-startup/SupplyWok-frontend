import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrder } from '../../../domain/model/purchase-order.entity';
import { OrderItem } from '../../../domain/model/order-item.entity';

@Component({
  selector: 'app-purchase-orders-table',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './purchase-orders-table.component.html',
  styleUrl: './purchase-orders-table.component.css'
})
export class PurchaseOrdersTableComponent {
  @Input({ required: true }) purchaseOrders: PurchaseOrder[] = [];
  @Input() loading = false;

  protected searchValue = '';
  protected selectedPurchaseOrder: PurchaseOrder | null = null;

  protected get filteredPurchaseOrders(): PurchaseOrder[] {
    const normalizedSearchValue = this.searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return this.purchaseOrders;
    }

    return this.purchaseOrders.filter((purchaseOrder) => {
      const supplierName = String(purchaseOrder.supplierName ?? '').toLowerCase();
      const priority = String(purchaseOrder.priority ?? '').toLowerCase();
      const status = String(purchaseOrder.status ?? '').toLowerCase();
      const id = String(purchaseOrder.id ?? '').toLowerCase();

      return supplierName.includes(normalizedSearchValue)
        || priority.includes(normalizedSearchValue)
        || status.includes(normalizedSearchValue)
        || id.includes(normalizedSearchValue);
    });
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

  protected getPriorityKey(priority: string): string {
    const translations: Record<string, string> = {
      'High': 'supply-and-purchasing.shared.priority.high',
      'Medium': 'supply-and-purchasing.shared.priority.medium',
      'Low': 'supply-and-purchasing.shared.priority.low'
    };

    return translations[priority] ?? priority;
  }

  protected getStatusClass(status: string): string {
    if (status === 'Pending') return 'purchase-orders-table__badge--warning';
    if (status === 'In Preparation' || status === 'Confirmed' || status === 'In Transit') return 'purchase-orders-table__badge--info';
    if (status === 'Delivered') return 'purchase-orders-table__badge--success';
    if (status === 'Delayed') return 'purchase-orders-table__badge--danger';
    return 'purchase-orders-table__badge--secondary';
  }

  protected formatCode(id: number | string | null): string {
    return `PO-${String(id ?? '').padStart(5, '0')}`;
  }

  protected calculateOrderTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + this.calculateItemSubtotal(item), 0);
  }

  protected calculateItemSubtotal(item: OrderItem): number {
    return Number(item.quantity || 0) * Number(item.unitPrice || 0);
  }

  protected formatCurrency(value: number): string {
    return Number.isFinite(value) ? value.toFixed(2) : '0.00';
  }

  protected openPurchaseOrderDetail(purchaseOrder: PurchaseOrder): void {
    this.selectedPurchaseOrder = purchaseOrder;
  }

  protected closePurchaseOrderDetail(): void {
    this.selectedPurchaseOrder = null;
  }
}
