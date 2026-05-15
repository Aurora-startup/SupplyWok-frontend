import { BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryItemsResponse, ItemResource } from './inventory-items-response';
import { InventoryItemAssembler } from './inventory-item-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class InventoryItemsApiEndpoint extends BaseApiEndpoint<
  InventoryItem,
  ItemResource,
  InventoryItemsResponse,
  InventoryItemAssembler
> {
  /**
   * Creates an instance of CategoriesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderInventoryItemsEndpointPath}`,
      new InventoryItemAssembler(),
    );
  }
}
