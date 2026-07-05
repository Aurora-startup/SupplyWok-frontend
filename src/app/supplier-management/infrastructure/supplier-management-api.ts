import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { Client } from '../domain/model/client.entity';
import { DeliveryRoute } from '../domain/model/delivery-route.entity';
import { DemandForecast } from '../../analytics/domain/model/demand-forecast.entity';
import { Order } from '../../supply-and-purchasing/domain/model/order.entity';
import { SupplierSettings } from '../domain/model/supplier-settings.entity';
import { SupplierSubscription } from '../domain/model/supplier-subscription.entity';
import { PurchaseOrderApiEndpoint } from '../../supply-and-purchasing/infrastructure/purchase-order-api-endpoint';
import { CatalogItemsApiEndpoint } from './catalog-items-api-endpoint';
import { ClientsApiEndpoint } from './clients-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class SupplierManagementApi extends BaseApi {
  private readonly ordersEndpoint: PurchaseOrderApiEndpoint;
  private readonly catalogItemsEndpoint: CatalogItemsApiEndpoint;
  private readonly clientsEndpoint: ClientsApiEndpoint;
  private readonly supplierId = environment.supplierPortalSupplierId;

  constructor(http: HttpClient) {
    super(http);
    this.ordersEndpoint = new PurchaseOrderApiEndpoint(http);
    this.catalogItemsEndpoint = new CatalogItemsApiEndpoint(http, this.supplierId);
    this.clientsEndpoint = new ClientsApiEndpoint(http, this.supplierId);
  }

  getOrders(): Observable<Order[]> {
    return this.ordersEndpoint.getAll();
  }

  updateOrder(order: Order): Observable<Order> {
    return this.ordersEndpoint.updateStatus(String(order.id), order.status);
  }

  getCatalogItems(): Observable<CatalogItem[]> {
    return this.catalogItemsEndpoint.getAll();
  }

  createCatalogItem(item: CatalogItem): Observable<CatalogItem> {
    return this.catalogItemsEndpoint.create(item);
  }

  updateCatalogItem(item: CatalogItem): Observable<CatalogItem> {
    return this.catalogItemsEndpoint.update(item, String(item.id));
  }

  deleteCatalogItem(id: number | string): Observable<void> {
    return this.catalogItemsEndpoint.delete(id);
  }

  getClients(): Observable<Client[]> {
    return this.clientsEndpoint.getAll();
  }

  getDeliveryRoutes(): Observable<DeliveryRoute[]> {
    return of([]);
  }

  getDemandForecast(): Observable<DemandForecast> {
    return of(new DemandForecast());
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
