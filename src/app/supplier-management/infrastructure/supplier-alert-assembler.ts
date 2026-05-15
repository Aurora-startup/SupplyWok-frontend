import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierAlertResource, SupplierAlertsResponse } from './supplier-management-response';

export class SupplierAlertAssembler extends BaseAssembler<SupplierAlert, SupplierAlertResource, SupplierAlertsResponse> {
  toEntityFromResource(resource: SupplierAlertResource): SupplierAlert {
    return new SupplierAlert({
      id: resource.id ?? null,
      severity: resource.severity ?? '',
      detail: resource.detail ?? '',
      date: resource.date ?? '',
      status: resource.status ?? ''
    });
  }

  toResourceFromEntity(entity: SupplierAlert): SupplierAlertResource {
    return {
      id: entity.id,
      severity: entity.severity,
      detail: entity.detail,
      date: entity.date,
      status: entity.status
    };
  }

  toEntitiesFromResponse(response: SupplierAlertsResponse): SupplierAlert[] {
    const resources = response.alerts ?? response.supplierAlerts ?? response['supplier-alerts'] ?? [];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
