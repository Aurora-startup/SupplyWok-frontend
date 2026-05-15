import { Injectable } from '@angular/core';
import { computed, inject, signal } from '@angular/core';
import { retry } from 'rxjs';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { Client } from '../domain/model/client.entity';
import { DeliveryRoute } from '../domain/model/delivery-route.entity';
import { DemandForecast } from '../domain/model/demand-forecast.entity';
import { Order } from '../domain/model/order.entity';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierContact, SupplierNotifications, SupplierSettings } from '../domain/model/supplier-settings.entity';
import { SupplierSubscription } from '../domain/model/supplier-subscription.entity';
import { SupplierManagementApi } from '../infrastructure/supplier-management-api';

@Injectable({
  providedIn: 'root',
})
export class SupplierManagementStore {
  private readonly supplierManagementApi = inject(SupplierManagementApi);

  private readonly ordersSignal = signal<Order[]>([]);
  private readonly catalogItemsSignal = signal<CatalogItem[]>([]);
  private readonly clientsSignal = signal<Client[]>([]);
  private readonly deliveryRoutesSignal = signal<DeliveryRoute[]>([]);
  private readonly demandForecastSignal = signal<DemandForecast>(new DemandForecast());
  private readonly alertsSignal = signal<SupplierAlert[]>([]);
  private readonly supplierSettingsSignal = signal<SupplierSettings>(new SupplierSettings());
  private readonly supplierSubscriptionSignal = signal<SupplierSubscription>(new SupplierSubscription());
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly orders = this.ordersSignal.asReadonly();
  readonly catalogItems = this.catalogItemsSignal.asReadonly();
  readonly clients = this.clientsSignal.asReadonly();
  readonly deliveryRoutes = this.deliveryRoutesSignal.asReadonly();
  readonly demandForecast = this.demandForecastSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly supplierSettings = this.supplierSettingsSignal.asReadonly();
  readonly supplierSubscription = this.supplierSubscriptionSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly ordersCount = computed(() => this.orders().length);
  readonly pendingOrdersCount = computed(() => this.orders().filter((order) => order.status === 'Pending').length);
  readonly inTransitOrdersCount = computed(() => this.orders().filter((order) => order.status === 'In Transit').length);
  readonly deliveredOrdersCount = computed(() => this.orders().filter((order) => order.status === 'Delivered').length);
  readonly openAlertsCount = computed(() => this.alerts().filter((alert) => alert.status === 'pending').length);
  readonly scheduledDeliveriesCount = computed(() =>
    this.deliveryRoutes().filter((route) => ['planned', 'in-progress'].includes(route.status)).length
  );
  readonly demandOutlook = computed(() => {
    if (!this.clients().length) return '+0%';
    const total = this.clients().reduce((sum, client) => sum + client.demandProjectionPercent, 0);
    return `+${Math.round(total / this.clients().length)}%`;
  });

  loadDashboard(): void {
    this.loadOrders();
    this.loadDeliveryRoutes();
    this.loadDemandForecast();
    this.loadAlerts();
    this.loadClients();
  }

  loadOrders(): void {
    this.startLoading();
    this.supplierManagementApi.getOrders().pipe(retry(2)).subscribe({
      next: (orders) => this.finishLoading(() => this.ordersSignal.set(orders)),
      error: (error) => this.failLoading(error, 'Failed to load supplier orders')
    });
  }

  updateOrderStatus(order: Order, status: string): void {
    const updatedOrder = new Order({
      id: order.id,
      code: order.code,
      supplierId: order.supplierId,
      supplierName: order.supplierName,
      restaurantName: order.restaurantName,
      orderDate: order.orderDate,
      estimatedDate: order.estimatedDate,
      priority: order.priority,
      status,
      items: order.items
    });

    this.startLoading();
    this.supplierManagementApi.updateOrder(updatedOrder).pipe(retry(2)).subscribe({
      next: (persistedOrder) => this.finishLoading(() => {
        this.ordersSignal.update((orders) => orders.map((item) => item.id === persistedOrder.id ? persistedOrder : item));
      }),
      error: (error) => this.failLoading(error, 'Failed to update supplier order')
    });
  }

  getOrderById(id: number | string | null | undefined): Order | undefined {
    return this.orders().find((order) => String(order.id) === String(id));
  }

  loadCatalogItems(): void {
    this.startLoading();
    this.supplierManagementApi.getCatalogItems().pipe(retry(2)).subscribe({
      next: (items) => this.finishLoading(() => this.catalogItemsSignal.set(items)),
      error: (error) => this.failLoading(error, 'Failed to load catalog items')
    });
  }

  createCatalogItem(item: CatalogItem): void {
    this.startLoading();
    this.supplierManagementApi.createCatalogItem(item).pipe(retry(2)).subscribe({
      next: (createdItem) => this.finishLoading(() => this.catalogItemsSignal.update((items) => [createdItem, ...items])),
      error: (error) => this.failLoading(error, 'Failed to create catalog item')
    });
  }

  updateCatalogItem(item: CatalogItem): void {
    this.startLoading();
    this.supplierManagementApi.updateCatalogItem(item).pipe(retry(2)).subscribe({
      next: (updatedItem) => this.finishLoading(() => {
        this.catalogItemsSignal.update((items) => items.map((current) => current.id === updatedItem.id ? updatedItem : current));
      }),
      error: (error) => this.failLoading(error, 'Failed to update catalog item')
    });
  }

  deleteCatalogItem(id: number | string): void {
    this.startLoading();
    this.supplierManagementApi.deleteCatalogItem(id).pipe(retry(2)).subscribe({
      next: () => this.finishLoading(() => {
        this.catalogItemsSignal.update((items) => items.filter((item) => String(item.id) !== String(id)));
      }),
      error: (error) => this.failLoading(error, 'Failed to delete catalog item')
    });
  }

  getCatalogItemById(id: number | string | null | undefined): CatalogItem | undefined {
    return this.catalogItems().find((item) => String(item.id) === String(id));
  }

  loadClients(): void {
    this.startLoading();
    this.supplierManagementApi.getClients().pipe(retry(2)).subscribe({
      next: (clients) => this.finishLoading(() => this.clientsSignal.set(clients)),
      error: (error) => this.failLoading(error, 'Failed to load clients')
    });
  }

  loadDeliveryRoutes(): void {
    this.startLoading();
    this.supplierManagementApi.getDeliveryRoutes().pipe(retry(2)).subscribe({
      next: (routes) => this.finishLoading(() => this.deliveryRoutesSignal.set(routes)),
      error: (error) => this.failLoading(error, 'Failed to load delivery routes')
    });
  }

  loadDemandForecast(): void {
    this.startLoading();
    this.supplierManagementApi.getDemandForecast().pipe(retry(2)).subscribe({
      next: (forecast) => this.finishLoading(() => this.demandForecastSignal.set(forecast)),
      error: (error) => this.failLoading(error, 'Failed to load demand forecast')
    });
  }

  loadAlerts(): void {
    this.startLoading();
    this.supplierManagementApi.getAlerts().pipe(retry(2)).subscribe({
      next: (alerts) => this.finishLoading(() => this.alertsSignal.set(alerts)),
      error: (error) => this.failLoading(error, 'Failed to load alerts')
    });
  }

  acknowledgeAlert(alert: SupplierAlert): void {
    const updatedAlert = new SupplierAlert({
      id: alert.id,
      severity: alert.severity,
      detail: alert.detail,
      date: alert.date,
      status: 'acknowledged'
    });

    this.startLoading();
    this.supplierManagementApi.updateAlert(updatedAlert).pipe(retry(2)).subscribe({
      next: (persistedAlert) => this.finishLoading(() => {
        this.alertsSignal.update((alerts) => alerts.map((item) => item.id === persistedAlert.id ? persistedAlert : item));
      }),
      error: (error) => this.failLoading(error, 'Failed to acknowledge alert')
    });
  }

  getAlertById(id: number | string | null | undefined): SupplierAlert | undefined {
    return this.alerts().find((alert) => String(alert.id) === String(id));
  }

  loadSupplierSettings(): void {
    this.startLoading();
    this.supplierManagementApi.getSupplierSettings().pipe(retry(2)).subscribe({
      next: (settings) => this.finishLoading(() => this.supplierSettingsSignal.set(settings)),
      error: (error) => this.failLoading(error, 'Failed to load supplier settings')
    });
  }

  updateSupplierSettings(settings: {
    id: number | string | null;
    supplierName: string;
    supportContact: string;
    notifications: SupplierNotifications;
    serviceZones: string[];
    contacts: SupplierContact[];
  }): void {
    this.startLoading();
    this.supplierManagementApi.updateSupplierSettings(new SupplierSettings(settings)).pipe(retry(2)).subscribe({
      next: (persistedSettings) => this.finishLoading(() => this.supplierSettingsSignal.set(persistedSettings)),
      error: (error) => this.failLoading(error, 'Failed to update supplier settings')
    });
  }

  loadSupplierSubscription(): void {
    this.startLoading();
    this.supplierManagementApi.getSupplierSubscription().pipe(retry(2)).subscribe({
      next: (subscription) => this.finishLoading(() => this.supplierSubscriptionSignal.set(subscription)),
      error: (error) => this.failLoading(error, 'Failed to load supplier subscription')
    });
  }

  private startLoading(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
  }

  private finishLoading(update: () => void): void {
    update();
    this.loadingSignal.set(false);
  }

  private failLoading(error: unknown, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
