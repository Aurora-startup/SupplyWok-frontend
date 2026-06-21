import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SupplierSettings } from '../domain/model/supplier-settings.entity';
import { SupplierSettingsResource, SupplierSettingsResponse } from './supplier-settings-response';

export class SupplierSettingsAssembler implements BaseAssembler<SupplierSettings, SupplierSettingsResource, SupplierSettingsResponse> {
  toEntityFromResource(resource: SupplierSettingsResource): SupplierSettings {
    return new SupplierSettings({
      id: resource.id ?? null,
      supplierName: resource.supplierName ?? '',
      supportContact: resource.supportContact ?? '',
      notifications: resource.notifications ?? { email: false, sms: false },
      serviceZones: resource.serviceZones ?? [],
      contacts: resource.contacts ?? []
    });
  }

  toResourceFromEntity(entity: SupplierSettings): SupplierSettingsResource {
    return {
      id: entity.id,
      supplierName: entity.supplierName,
      supportContact: entity.supportContact,
      notifications: entity.notifications,
      serviceZones: entity.serviceZones,
      contacts: entity.contacts
    };
  }

  toEntitiesFromResponse(response: SupplierSettingsResponse): SupplierSettings[] {
    const resource = response.supplierSettings ?? response.supplierSettingsList?.[0] ?? response['supplier-settings']?.[0];
    return resource ? [this.toEntityFromResource(resource)] : [];
  }
}
