import { Injectable } from '@angular/core';
import { computed, inject, signal } from '@angular/core';
import { catchError, forkJoin, of, retry } from 'rxjs';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { Client } from '../domain/model/client.entity';
import { DemandForecast } from '../../analytics/domain/model/demand-forecast.entity';
import { Order } from '../../supply-and-purchasing/domain/model/order.entity';
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
  private readonly demandForecastSignal = signal<DemandForecast>(new DemandForecast());
  private readonly supplierSubscriptionSignal = signal<SupplierSubscription>(new SupplierSubscription());
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly orders = this.ordersSignal.asReadonly();
  readonly catalogItems = this.catalogItemsSignal.asReadonly();
  readonly clients = this.clientsSignal.asReadonly();
  readonly demandForecast = this.demandForecastSignal.asReadonly();
  readonly supplierSubscription = this.supplierSubscriptionSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly ordersCount = computed(() => this.orders().length);
  readonly pendingOrdersCount = computed(() => this.orders().filter((order) => order.status === 'Pending').length);
  readonly inTransitOrdersCount = computed(() => this.orders().filter((order) => order.status === 'In Transit').length);
  readonly deliveredOrdersCount = computed(() => this.orders().filter((order) => order.status === 'Delivered').length);
  readonly demandOutlook = computed(() => {
    if (!this.clients().length) return '+0%';
    const total = this.clients().reduce((sum, client) => sum + client.demandProjectionPercent, 0);
    return `+${Math.round(total / this.clients().length)}%`;
  });

  loadDashboard(): void {
    this.loadOrders();
    this.loadDemandForecast();
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
    forkJoin({
      clients: this.supplierManagementApi.getClients().pipe(
        retry(2),
        catchError(() => of([] as Client[]))
      ),
      orders: this.supplierManagementApi.getOrders().pipe(
        retry(2),
        catchError(() => of(this.orders()))
      )
    }).subscribe({
      next: ({ clients, orders }) => this.finishLoading(() => {
        this.clientsSignal.set(this.buildSupplierClients(clients, orders));
      }),
      error: (error) => this.failLoading(error, 'Failed to load clients')
    });
  }

  loadDemandForecast(): void {
    this.startLoading();
    this.supplierManagementApi.getDemandForecast().pipe(retry(2)).subscribe({
      next: (forecast) => this.finishLoading(() => this.demandForecastSignal.set(forecast)),
      error: (error) => this.failLoading(error, 'Failed to load demand forecast')
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

  private buildSupplierClients(clients: Client[], orders: Order[]): Client[] {
    const ordersByRestaurant = orders.reduce((groups, order) => {
      const restaurantName = order.restaurantName?.trim();
      if (!restaurantName) return groups;
      const key = restaurantName.toLowerCase();
      groups.set(key, [...(groups.get(key) ?? []), order]);
      return groups;
    }, new Map<string, Order[]>());

    const clientKeys = new Set<string>(clients.map((client) => client.name.trim().toLowerCase()).filter(Boolean));
    const enrichedClients = clients.map((client) => this.enrichClientWithOrders(client, ordersByRestaurant.get(client.name.trim().toLowerCase()) ?? []));
    const clientsFromOrders = Array.from(ordersByRestaurant.entries())
      .filter(([key]) => !clientKeys.has(key))
      .map(([, restaurantOrders]) => this.enrichClientWithOrders(new Client({
        name: restaurantOrders[0]?.restaurantName ?? '',
        district: '-',
        status: 'active'
      }), restaurantOrders));

    return [...enrichedClients, ...clientsFromOrders]
      .filter((client) => client.name.trim())
      .sort((first, second) => first.name.localeCompare(second.name));
  }

  private enrichClientWithOrders(client: Client, orders: Order[]): Client {
    if (!orders.length) return client;

    const total = orders.reduce((sum, order) => sum + this.getOrderTotal(order), 0);
    const latestOrder = orders
      .map((order) => order.orderDate)
      .filter(Boolean)
      .sort((first, second) => new Date(second).getTime() - new Date(first).getTime())[0] ?? client.lastOrderDate;

    return new Client({
      id: client.id,
      name: client.name,
      district: client.district || '-',
      frequency: `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`,
      averageTicket: Math.round((total / orders.length) * 100) / 100,
      demandProjectionPercent: Math.max(client.demandProjectionPercent, Math.min(99, orders.length * 8)),
      status: client.status || 'active',
      lastOrderDate: latestOrder
    });
  }

  private getOrderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0), 0);
  }
}
