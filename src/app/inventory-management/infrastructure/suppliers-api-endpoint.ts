import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Supplier } from '../domain/model/supplier.entity';
import { SuppliersResponse, SupplierResource } from './suppliers-response';
import { SupplierAssembler } from './supplier-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class SuppliersApiEndpoint extends BaseApiEndpoint<
  Supplier,
  SupplierResource,
  SuppliersResponse,
  SupplierAssembler
> {
  /**
   * Creates an instance of CategoriesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformApiBaseUrl}${environment.platformProviderSuppliersEndpointPath}`,
      new SupplierAssembler(),
    );
  }
}
