import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface CatalogItemResource extends BaseResource {
  name?: string;
  category?: string;
  price?: number;
  unit?: string;
  deliveryConditions?: string;
}

export interface CatalogItemsResponse extends BaseResponse {
  catalogItems?: CatalogItemResource[];
  'catalog-items'?: CatalogItemResource[];
}
