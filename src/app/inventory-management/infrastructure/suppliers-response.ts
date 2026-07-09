import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SuppliersResponse extends BaseResponse {
  suppliers: SupplierResource[];
}

export interface SupplierResource extends BaseResource {
  id: number;
  name: string;
  email?: string;
}
