import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierAlertAssembler } from './supplier-alert-assembler';
import { SupplierAlertResource, SupplierAlertsResponse } from './supplier-management-response';

export class SupplierAlertsApiEndpoint extends BaseApiEndpoint<SupplierAlert, SupplierAlertResource, SupplierAlertsResponse, SupplierAlertAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierCrudApiBaseUrl}${environment.supplierAlertsEndpointPath}`, new SupplierAlertAssembler());
  }
}
