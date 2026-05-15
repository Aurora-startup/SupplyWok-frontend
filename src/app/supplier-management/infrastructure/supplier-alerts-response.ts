import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SupplierAlertResource extends BaseResource {
  severity?: string;
  detail?: string;
  date?: string;
  status?: string;
}

export interface SupplierAlertsResponse extends BaseResponse {
  alerts?: SupplierAlertResource[];
  supplierAlerts?: SupplierAlertResource[];
  'supplier-alerts'?: SupplierAlertResource[];
}
