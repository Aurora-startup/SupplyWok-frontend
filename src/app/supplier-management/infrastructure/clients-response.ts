import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ClientResource extends BaseResource {
  name?: string;
  district?: string;
  frequency?: string;
  averageTicket?: number;
  demandProjectionPercent?: number;
  status?: string;
  lastOrderDate?: string;
}

export interface ClientsResponse extends BaseResponse {
  clients?: ClientResource[];
}
