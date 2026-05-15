import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { CatalogItemAssembler } from './catalog-item-assembler';
import { CatalogItemResource, CatalogItemsResponse } from './supplier-management-response';

export class CatalogItemsApiEndpoint extends BaseApiEndpoint<CatalogItem, CatalogItemResource, CatalogItemsResponse, CatalogItemAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierCrudApiBaseUrl}${environment.catalogItemsEndpointPath}`, new CatalogItemAssembler());
  }
}
