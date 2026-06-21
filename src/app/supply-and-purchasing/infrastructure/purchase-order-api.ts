import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Order } from '../domain/model/order.entity';
import { PurchaseOrderApiEndpoint } from './purchase-order-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderApi extends BaseApi {
  private readonly purchaseOrdersEndpoint: PurchaseOrderApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.purchaseOrdersEndpoint = new PurchaseOrderApiEndpoint(http);
  }

  getPurchaseOrders(): Observable<Order[]> {
    return this.purchaseOrdersEndpoint.getAll();
  }

  createPurchaseOrder(resource: Order): Observable<Order> {
    return this.purchaseOrdersEndpoint.create(resource);
  }
}
