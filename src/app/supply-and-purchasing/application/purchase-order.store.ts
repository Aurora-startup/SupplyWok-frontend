import { Injectable, computed, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Order } from '../domain/model/order.entity';
import { OrderItem } from '../domain/model/order-item.entity';
import { PurchaseOrderApi } from '../infrastructure/purchase-order-api';

type ValidationErrors = Record<string, string | Record<string, string> | Record<number, Record<string, string>>>;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderStore {
  private readonly purchaseOrderApi = inject(PurchaseOrderApi);
  private readonly translate = inject(TranslateService);

  private readonly purchaseOrdersSignal = signal<Order[]>([]);
  private readonly errorsSignal = signal<string[]>([]);
  private readonly validationErrorsSignal = signal<ValidationErrors>({});
  private readonly purchaseOrdersLoadedSignal = signal(false);
  private readonly loadingSignal = signal(false);

  readonly purchaseOrders = this.purchaseOrdersSignal.asReadonly();
  readonly errors = this.errorsSignal.asReadonly();
  readonly validationErrors = this.validationErrorsSignal.asReadonly();
  readonly purchaseOrdersLoaded = this.purchaseOrdersLoadedSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly purchaseOrdersCount = computed(() =>
    this.purchaseOrdersLoadedSignal() ? this.purchaseOrdersSignal().length : 0
  );

  readonly pendingPurchaseOrdersCount = computed(() =>
    this.purchaseOrdersSignal().filter((purchaseOrder) => purchaseOrder.status === 'Pending').length
  );

  readonly highPriorityPurchaseOrdersCount = computed(() =>
    this.purchaseOrdersSignal().filter((purchaseOrder) => purchaseOrder.priority === 'High').length
  );

  ensurePurchaseOrdersLoaded(): void {
    if (!this.purchaseOrdersLoadedSignal() && !this.loadingSignal()) {
      this.fetchPurchaseOrders();
    }
  }

  fetchPurchaseOrders(): void {
    this.loadingSignal.set(true);
    this.purchaseOrderApi.getPurchaseOrders().subscribe({
      next: (purchaseOrders) => {
        this.purchaseOrdersSignal.set(purchaseOrders);
        this.purchaseOrdersLoadedSignal.set(true);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.pushError(error);
        this.loadingSignal.set(false);
      }
    });
  }

  clearValidationErrors(): void {
    this.validationErrorsSignal.set({});
  }

  clearValidationScope(scope: string): void {
    const nextValidationErrors = { ...this.validationErrorsSignal() };
    delete nextValidationErrors[scope];
    this.validationErrorsSignal.set(nextValidationErrors);
  }

  validateOrderItem(item: Partial<OrderItem>, scope = 'draftLine'): boolean {
    const itemValidationErrors = this.collectOrderItemValidationErrors(item);
    const nextValidationErrors = { ...this.validationErrorsSignal() };

    if (Object.keys(itemValidationErrors).length > 0) {
      nextValidationErrors[scope] = itemValidationErrors;
      this.validationErrorsSignal.set(nextValidationErrors);
      return false;
    }

    delete nextValidationErrors[scope];
    this.validationErrorsSignal.set(nextValidationErrors);
    return true;
  }

  validatePurchaseOrder(purchaseOrder: Order): boolean {
    const nextValidationErrors: ValidationErrors = {};

    if (!String(purchaseOrder.supplierId ?? '').trim()) {
      nextValidationErrors['supplierId'] = this.translate.instant('supply-and-purchasing.validation.supplier-required');
    }

    if (!String(purchaseOrder.orderDate ?? '').trim()) {
      nextValidationErrors['orderDate'] = this.translate.instant('supply-and-purchasing.validation.order-date-required');
    }

    if (!String(purchaseOrder.estimatedDate ?? '').trim()) {
      nextValidationErrors['estimatedDate'] = this.translate.instant('supply-and-purchasing.validation.estimated-date-required');
    }

    if (!String(purchaseOrder.priority ?? '').trim()) {
      nextValidationErrors['priority'] = this.translate.instant('supply-and-purchasing.validation.priority-required');
    }

    if (!Array.isArray(purchaseOrder.items) || purchaseOrder.items.length === 0) {
      nextValidationErrors['items'] = this.translate.instant('supply-and-purchasing.validation.items-required');
    } else {
      const itemLinesValidationErrors: Record<number, Record<string, string>> = {};
      purchaseOrder.items.forEach((item, index) => {
        const itemValidationErrors = this.collectOrderItemValidationErrors(item);
        if (Object.keys(itemValidationErrors).length > 0) {
          itemLinesValidationErrors[index] = itemValidationErrors;
        }
      });

      if (Object.keys(itemLinesValidationErrors).length > 0) {
        nextValidationErrors['itemLines'] = itemLinesValidationErrors;
      }
    }

    this.validationErrorsSignal.set(nextValidationErrors);
    return Object.keys(nextValidationErrors).length === 0;
  }

  private readonly orderCreatedSignal = signal(false);
  readonly orderCreated = this.orderCreatedSignal.asReadonly();

  resetOrderCreated(): void {
    this.orderCreatedSignal.set(false);
  }

  addPurchaseOrder(purchaseOrder: Order): void {
    this.clearValidationScope('draftLine');

    if (!this.validatePurchaseOrder(purchaseOrder)) {
      return;
    }

    this.loadingSignal.set(true);
    this.purchaseOrderApi.createPurchaseOrder(purchaseOrder).subscribe({
      next: (newPurchaseOrder) => {
        this.purchaseOrdersSignal.update((orders) => [newPurchaseOrder, ...orders]);
        this.clearValidationErrors();
        this.orderCreatedSignal.set(true);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.pushError(error);
        this.loadingSignal.set(false);
      }
    });
  }

  private collectOrderItemValidationErrors(item: Partial<OrderItem>): Record<string, string> {
    const itemValidationErrors: Record<string, string> = {};
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);

    if (!String(item.productName ?? '').trim()) {
      itemValidationErrors['productName'] = this.translate.instant('supply-and-purchasing.validation.product-name-required');
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      itemValidationErrors['quantity'] = this.translate.instant('supply-and-purchasing.validation.quantity-invalid');
    }

    if (!String(item.unitType ?? '').trim()) {
      itemValidationErrors['unitType'] = this.translate.instant('supply-and-purchasing.validation.unit-required');
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      itemValidationErrors['unitPrice'] = this.translate.instant('supply-and-purchasing.validation.unit-price-invalid');
    }

    return itemValidationErrors;
  }

  private pushError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    this.errorsSignal.update((errors) => [...errors, message]);
  }
}
