import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Supplier } from '../domain/model/supplier.entity';
import { SupplierAssembler } from './supplier.assembler';
import { SupplierResource, SuppliersResponse } from './supplier-response';

export class SupplierApiEndpoint extends BaseApiEndpoint<
  Supplier,
  SupplierResource,
  SuppliersResponse,
  SupplierAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.supplyAndPurchasingSuppliersApiBaseUrl}${environment.supplyAndPurchasingSuppliersEndpointPath}`,
      new SupplierAssembler()
    );
  }
}
