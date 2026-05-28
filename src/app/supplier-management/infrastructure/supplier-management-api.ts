import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { Client } from '../domain/model/client.entity';
import { DeliveryRoute } from '../domain/model/delivery-route.entity';
import { DemandForecast } from '../domain/model/demand-forecast.entity';
import { Order } from '../domain/model/order.entity';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierSettings } from '../domain/model/supplier-settings.entity';
import { SupplierSubscription } from '../domain/model/supplier-subscription.entity';
import { CatalogItemsApiEndpoint } from './catalog-items-api-endpoint';
import { ClientsApiEndpoint } from './clients-api-endpoint';
import { DeliveryRoutesApiEndpoint } from './delivery-routes-api-endpoint';
import { DemandForecastsApiEndpoint } from './demand-forecasts-api-endpoint';
import { OrdersApiEndpoint } from './orders-api-endpoint';
import { SupplierAlertsApiEndpoint } from './supplier-alerts-api-endpoint';
import { SupplierSettingsApiEndpoint } from './supplier-settings-api-endpoint';
import { SupplierSubscriptionsApiEndpoint } from './supplier-subscriptions-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class SupplierManagementApi extends BaseApi {
  private readonly ordersEndpoint: OrdersApiEndpoint;
  private readonly catalogItemsEndpoint: CatalogItemsApiEndpoint;
  private readonly clientsEndpoint: ClientsApiEndpoint;
  private readonly deliveryRoutesEndpoint: DeliveryRoutesApiEndpoint;
  private readonly demandForecastsEndpoint: DemandForecastsApiEndpoint;
  private readonly supplierAlertsEndpoint: SupplierAlertsApiEndpoint;
  private readonly supplierSettingsEndpoint: SupplierSettingsApiEndpoint;
  private readonly supplierSubscriptionsEndpoint: SupplierSubscriptionsApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.ordersEndpoint = new OrdersApiEndpoint(http);
    this.catalogItemsEndpoint = new CatalogItemsApiEndpoint(http);
    this.clientsEndpoint = new ClientsApiEndpoint(http);
    this.deliveryRoutesEndpoint = new DeliveryRoutesApiEndpoint(http);
    this.demandForecastsEndpoint = new DemandForecastsApiEndpoint(http);
    this.supplierAlertsEndpoint = new SupplierAlertsApiEndpoint(http);
    this.supplierSettingsEndpoint = new SupplierSettingsApiEndpoint(http);
    this.supplierSubscriptionsEndpoint = new SupplierSubscriptionsApiEndpoint(http);
  }

  getOrders(): Observable<Order[]> { return this.ordersEndpoint.getAll(); }
  updateOrder(order: Order): Observable<Order> { return this.ordersEndpoint.update(order, String(order.id)); }

  getCatalogItems(): Observable<CatalogItem[]> { return this.catalogItemsEndpoint.getAll(); }
  createCatalogItem(item: CatalogItem): Observable<CatalogItem> { return this.catalogItemsEndpoint.create(item); }
  updateCatalogItem(item: CatalogItem): Observable<CatalogItem> { return this.catalogItemsEndpoint.update(item, String(item.id)); }
  deleteCatalogItem(id: number | string): Observable<void> { return this.catalogItemsEndpoint.delete(id); }

  getClients(): Observable<Client[]> { return this.clientsEndpoint.getAll(); }
  getDeliveryRoutes(): Observable<DeliveryRoute[]> { return this.deliveryRoutesEndpoint.getAll(); }
  getDemandForecast(): Observable<DemandForecast> {
    return this.demandForecastsEndpoint.getAll().pipe(map((forecasts) => forecasts[0] ?? new DemandForecast()));
  }

  getAlerts(): Observable<SupplierAlert[]> { return this.supplierAlertsEndpoint.getAll(); }
  updateAlert(alert: SupplierAlert): Observable<SupplierAlert> { return this.supplierAlertsEndpoint.update(alert, String(alert.id)); }

  getSupplierSettings(): Observable<SupplierSettings> {
    return this.supplierSettingsEndpoint.getAll().pipe(map((settings) => settings[0] ?? new SupplierSettings()));
  }
  updateSupplierSettings(settings: SupplierSettings): Observable<SupplierSettings> {
    return this.supplierSettingsEndpoint.update(settings, String(settings.id));
  }

  getSupplierSubscription(): Observable<SupplierSubscription> {
    return this.supplierSubscriptionsEndpoint.getAll().pipe(map((subscriptions) => subscriptions[0] ?? new SupplierSubscription()));
  }
}
