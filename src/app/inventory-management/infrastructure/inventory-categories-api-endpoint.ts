import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { InventoryCategory } from '../domain/model/inventory-category.entity';
import { InventoryCategoriesResponse, CategoryResource } from './inventory-categories-response';
import { InventoryCategoryAssembler } from './inventory-category-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class CategoriesApiEndpoint extends BaseApiEndpoint<
  InventoryCategory,
  CategoryResource,
  InventoryCategoriesResponse,
  InventoryCategoryAssembler
> {
  /**
   * Creates an instance of CategoriesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderCategoriesEndpointPath}`,
      new InventoryCategoryAssembler(),
    );
  }
}
