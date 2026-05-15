import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Supplier } from '../domain/model/supplier.entity';
import { SupplierApiEndpoint } from './supplier-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class SupplierApi extends BaseApi {
  private readonly suppliersEndpoint: SupplierApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.suppliersEndpoint = new SupplierApiEndpoint(http);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.suppliersEndpoint.getAll();
  }
}
