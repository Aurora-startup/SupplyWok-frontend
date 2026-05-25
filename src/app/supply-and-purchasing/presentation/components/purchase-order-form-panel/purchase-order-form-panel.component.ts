import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrder } from '../../../domain/model/purchase-order.entity';
import { OrderItem } from '../../../domain/model/order-item.entity';
import { PurchaseOrderStore } from '../../../application/purchase-order.store';

interface SupplierOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-purchase-order-form-panel',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './purchase-order-form-panel.component.html',
  styleUrl: './purchase-order-form-panel.component.css'
})
export class PurchaseOrderFormPanelComponent {
  protected readonly store = inject(PurchaseOrderStore);

  constructor() {
    effect(() => {
      if (this.store.orderCreated()) {
        this.orderLines = [];
        this.resetDraftLine();
        this.store.resetOrderCreated();
      }
    });
  }

  protected readonly supplierOptions: SupplierOption[] = [
    { id: '201', name: 'Golden Wok Produce' },
    { id: '202', name: 'Andes Cold Chain' },
    { id: '203', name: 'Orient Pantry Co.' }
  ];

  protected readonly priorityOptions = computed(() => [
    { value: 'High', labelKey: 'supply-and-purchasing.shared.priority.high' },
    { value: 'Medium', labelKey: 'supply-and-purchasing.shared.priority.medium' },
    { value: 'Low', labelKey: 'supply-and-purchasing.shared.priority.low' }
  ]);

  protected readonly draftLineErrorScope = signal('draftLine');

  protected readonly form = {
    supplierId: this.supplierOptions[0].id,
    supplierName: this.supplierOptions[0].name,
    orderDate: '2026-05-22',
    priority: 'Medium'
  };

  protected readonly draftLine = {
    productName: '',
    quantity: '50',
    unitType: 'Kg',
    unitPrice: '2.50'
  };

  protected orderLines: OrderItem[] = [];

  protected syncSupplierData(): void {
    const selectedSupplier = this.supplierOptions.find((supplier) => supplier.id === this.form.supplierId);
    this.form.supplierName = selectedSupplier?.name ?? '';
  }

  protected resetDraftLine(): void {
    this.draftLine.productName = '';
    this.draftLine.quantity = '50';
    this.draftLine.unitType = 'Kg';
    this.draftLine.unitPrice = '2.50';
  }

  protected buildOrderItemFromDraft(): OrderItem {
    return new OrderItem({
      id: Date.now() + Math.floor(Math.random() * 1000),
      inventoryItemId: null,
      productName: this.draftLine.productName,
      quantity: Number(this.draftLine.quantity || 0),
      unitPrice: Number(this.draftLine.unitPrice || 0),
      unitType: this.draftLine.unitType
    });
  }

  protected addLine(): void {
    if (!this.store.validateOrderItem(this.buildOrderItemFromDraft(), this.draftLineErrorScope())) {
      return;
    }

    this.orderLines = [...this.orderLines, this.buildOrderItemFromDraft()];
    this.store.clearValidationScope('items');
    this.store.clearValidationScope(this.draftLineErrorScope());
    this.resetDraftLine();
  }

  protected removeLine(index: number): void {
    this.orderLines = this.orderLines.filter((_, itemIndex) => itemIndex !== index);
  }

  protected handleSubmit(): void {
    this.syncSupplierData();

    const items = [...this.orderLines];
    if (this.draftLine.productName.trim()) {
      if (!this.store.validateOrderItem(this.buildOrderItemFromDraft(), this.draftLineErrorScope())) {
        return;
      }
      items.push(this.buildOrderItemFromDraft());
    } else {
      this.store.clearValidationScope(this.draftLineErrorScope());
    }

    const purchaseOrder = new PurchaseOrder({
      supplierId: this.form.supplierId,
      supplierName: this.form.supplierName,
      orderDate: this.form.orderDate,
      priority: this.form.priority,
      status: 'Pending',
      items
    });

    this.store.addPurchaseOrder(purchaseOrder);
  }

  protected getFieldError(field: string): string {
    const errors = this.store.validationErrors();
    const value = errors[field];
    return typeof value === 'string' ? value : '';
  }

  protected getDraftFieldError(field: string): string {
    const draftErrors = this.store.validationErrors()[this.draftLineErrorScope()];
    if (!draftErrors || typeof draftErrors === 'string') {
      return '';
    }
    const scopedDraftErrors = draftErrors as Record<string, string>;
    const fieldError = scopedDraftErrors[field];
    return typeof fieldError === 'string' ? fieldError : '';
  }

  protected formatPrice(value: number): string {
    return Number.isFinite(value) ? value.toFixed(2) : '0.00';
  }
}
