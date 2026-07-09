import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierAlertResource, SupplierAlertsResponse } from './supplier-alerts-response';

export class SupplierAlertAssembler implements BaseAssembler<SupplierAlert, SupplierAlertResource, SupplierAlertsResponse> {
  toEntityFromResource(resource: SupplierAlertResource): SupplierAlert {
    return new SupplierAlert({
      id: resource.id ?? null,
      severity: this.normalizeSeverity(resource.severity),
      detail: resource.detail ?? '',
      date: resource.date ?? '',
      status: this.normalizeStatus(resource.status)
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

  private normalizeSeverity(value?: string): string {
    return String(value ?? '').trim().toLowerCase();
  }

  private normalizeStatus(value?: string): string {
    const normalized = String(value ?? '').trim().toLowerCase();
    if (normalized === 'pending') return 'open';
    if (normalized === 'resolved') return 'acknowledged';
    return normalized;
  }
}
