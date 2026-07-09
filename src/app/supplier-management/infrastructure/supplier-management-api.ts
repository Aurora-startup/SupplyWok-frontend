import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { IamStore } from '../../iam/application/iam.store';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { Client } from '../domain/model/client.entity';
import { DemandForecast } from '../../analytics/domain/model/demand-forecast.entity';
import { Order } from '../../supply-and-purchasing/domain/model/order.entity';
import { SupplierSubscription } from '../domain/model/supplier-subscription.entity';
import { PurchaseOrderApiEndpoint } from '../../supply-and-purchasing/infrastructure/purchase-order-api-endpoint';
import { CatalogItemsApiEndpoint } from './catalog-items-api-endpoint';
import { ClientsApiEndpoint } from './clients-api-endpoint';
import { SupplierResource } from '../../inventory-management/infrastructure/suppliers-response';

@Injectable({
  providedIn: 'root',
})
export class SupplierManagementApi extends BaseApi {
  private readonly ordersEndpoint: PurchaseOrderApiEndpoint;

  constructor(http: HttpClient, private readonly iamStore: IamStore) {
    super(http);
    this.ordersEndpoint = new PurchaseOrderApiEndpoint(http);
  }

  getOrders(): Observable<Order[]> {
    return this.resolveSupplierId().pipe(
      switchMap((supplierId) => this.ordersEndpoint.getAll().pipe(
        map((orders) => orders.filter((order) => String(order.supplierId) === String(supplierId)))
      ))
    );
  }

  updateOrder(order: Order): Observable<Order> {
    return this.ordersEndpoint.updateStatus(String(order.id), order.status);
  }

  getCatalogItems(): Observable<CatalogItem[]> {
    return this.resolveSupplierId().pipe(
      switchMap((supplierId) => new CatalogItemsApiEndpoint(this.http, supplierId).getAll())
    );
  }

  createCatalogItem(item: CatalogItem): Observable<CatalogItem> {
    return this.resolveSupplierId().pipe(
      switchMap((supplierId) => new CatalogItemsApiEndpoint(this.http, supplierId).create(item))
    );
  }

  updateCatalogItem(item: CatalogItem): Observable<CatalogItem> {
    return this.resolveSupplierId().pipe(
      switchMap((supplierId) => new CatalogItemsApiEndpoint(this.http, supplierId).update(item, String(item.id)))
    );
  }

  deleteCatalogItem(id: number | string): Observable<void> {
    return this.resolveSupplierId().pipe(
      switchMap((supplierId) => new CatalogItemsApiEndpoint(this.http, supplierId).delete(id))
    );
  }

  getClients(): Observable<Client[]> {
    return this.resolveSupplierId().pipe(
      switchMap((supplierId) => new ClientsApiEndpoint(this.http, supplierId).getAll())
    );
  }

  getDemandForecast(): Observable<DemandForecast> {
    return of(new DemandForecast());
  }

  getSupplierSubscription(): Observable<SupplierSubscription> {
    return of(new SupplierSubscription());
  }

  private resolveSupplierId(): Observable<number | string> {
    const currentEmail = this.iamStore.currentUser()?.email?.trim().toLowerCase();
    if (!currentEmail) {
      return of(environment.supplierPortalSupplierId);
    }

    return this.http.get<SupplierResource[]>(`${environment.supplyWokPlatformBaseUrl}${environment.suppliersEndpointPath}`).pipe(
      map((suppliers) => suppliers.find((supplier) => supplier.email?.trim().toLowerCase() === currentEmail)?.id ?? environment.supplierPortalSupplierId)
    );
  }
}
