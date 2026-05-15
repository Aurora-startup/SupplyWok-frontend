import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SupplierResource extends BaseResource {
  id: number | string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  category?: string;
  linkedDate?: string;
  sla?: string;
  responseTime?: string;
}

export interface SuppliersResponse extends BaseResponse {
  suppliers?: SupplierResource[];
}
