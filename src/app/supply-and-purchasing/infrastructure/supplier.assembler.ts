import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Supplier } from '../domain/model/supplier.entity';
import { SupplierResource, SuppliersResponse } from './supplier-response';

export class SupplierAssembler extends BaseAssembler<Supplier, SupplierResource, SuppliersResponse> {
  toEntityFromResource(resource: SupplierResource): Supplier {
    return new Supplier({
      id: resource.id ?? null,
      name: resource.name ?? '',
      contactName: resource.contactName ?? '',
      email: resource.email ?? '',
      phone: resource.phone ?? '',
      category: resource.category ?? '',
      linkedDate: resource.linkedDate ?? '',
      sla: resource.sla ?? '',
      responseTime: resource.responseTime ?? ''
    });
  }

  toResourceFromEntity(entity: Supplier): SupplierResource {
    return {
      id: entity.id ?? '',
      name: entity.name,
      contactName: entity.contactName,
      email: entity.email,
      phone: entity.phone,
      category: entity.category,
      linkedDate: entity.linkedDate,
      sla: entity.sla,
      responseTime: entity.responseTime
    };
  }

  toEntitiesFromResponse(response: SuppliersResponse): Supplier[] {
    const resources = Array.isArray(response.suppliers) ? response.suppliers : [];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
