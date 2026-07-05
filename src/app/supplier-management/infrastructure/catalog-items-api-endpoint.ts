import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { CatalogItemAssembler } from './catalog-item-assembler';
import { CatalogItemResource, CatalogItemsResponse } from './catalog-items-response';

export class CatalogItemsApiEndpoint extends BaseApiEndpoint<CatalogItem, CatalogItemResource, CatalogItemsResponse, CatalogItemAssembler> {
  constructor(http: HttpClient, supplierId: number | string) {
    super(
      http,
      `${environment.supplyWokPlatformBaseUrl}${environment.suppliersEndpointPath}/${supplierId}${environment.catalogItemsEndpointPath}`,
      new CatalogItemAssembler()
    );
  }
}
