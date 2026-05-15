import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SupplierSettings } from '../domain/model/supplier-settings.entity';
import { SupplierSettingsAssembler } from './supplier-settings-assembler';
import { SupplierSettingsResource, SupplierSettingsResponse } from './supplier-management-response';

export class SupplierSettingsApiEndpoint extends BaseApiEndpoint<SupplierSettings, SupplierSettingsResource, SupplierSettingsResponse, SupplierSettingsAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierGetApiBaseUrl}${environment.supplierSettingsEndpointPath}`, new SupplierSettingsAssembler());
  }
}
