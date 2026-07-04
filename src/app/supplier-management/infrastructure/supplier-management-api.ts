import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { Client } from '../domain/model/client.entity';
import { DeliveryRoute } from '../domain/model/delivery-route.entity';
import { DemandForecast } from '../../analytics/domain/model/demand-forecast.entity';
import { Order } from '../../supply-and-purchasing/domain/model/order.entity';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierSettings } from '../domain/model/supplier-settings.entity';
import { SupplierSubscription } from '../domain/model/supplier-subscription.entity';
import { PurchaseOrderApiEndpoint } from '../../supply-and-purchasing/infrastructure/purchase-order-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class SupplierManagementApi extends BaseApi {
  private readonly ordersEndpoint: PurchaseOrderApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.ordersEndpoint = new PurchaseOrderApiEndpoint(http);
  }

  getOrders(): Observable<Order[]> {
    return this.ordersEndpoint.getAll();
  }

  updateOrder(order: Order): Observable<Order> {
    return this.ordersEndpoint.update(order, String(order.id));
  }

  getCatalogItems(): Observable<CatalogItem[]> {
    return of([]);
  }

  createCatalogItem(item: CatalogItem): Observable<CatalogItem> {
    return of(item);
  }

  updateCatalogItem(item: CatalogItem): Observable<CatalogItem> {
    return of(item);
  }

  deleteCatalogItem(id: number | string): Observable<void> {
    return of(void 0);
  }

  getClients(): Observable<Client[]> {
    return of([]);
  }

  getDeliveryRoutes(): Observable<DeliveryRoute[]> {
    return of([]);
  }

  getDemandForecast(): Observable<DemandForecast> {
    return of(new DemandForecast());
  }

  getAlerts(): Observable<SupplierAlert[]> {
    return of([]);
  }

  updateAlert(alert: SupplierAlert): Observable<SupplierAlert> {
    return of(alert);
  }

  getSupplierSettings(): Observable<SupplierSettings> {
    return of(new SupplierSettings());
  }

  updateSupplierSettings(settings: SupplierSettings): Observable<SupplierSettings> {
    return of(settings);
  }

  getSupplierSubscription(): Observable<SupplierSubscription> {
    return of(new SupplierSubscription());
  }
}
