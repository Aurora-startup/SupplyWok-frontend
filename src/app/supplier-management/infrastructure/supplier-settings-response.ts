import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { SupplierContact, SupplierNotifications } from '../domain/model/supplier-settings.entity';

export interface SupplierSettingsResource extends BaseResource {
  supplierName?: string;
  supportContact?: string;
  notifications?: SupplierNotifications;
  serviceZones?: string[];
  contacts?: SupplierContact[];
}

export interface SupplierSettingsResponse extends BaseResponse {
  supplierSettings?: SupplierSettingsResource;
  supplierSettingsList?: SupplierSettingsResource[];
  'supplier-settings'?: SupplierSettingsResource[];
}
