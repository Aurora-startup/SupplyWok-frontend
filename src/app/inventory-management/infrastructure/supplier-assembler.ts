import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Supplier } from '../domain/model/supplier.entity';
import { SuppliersResponse, SupplierResource } from './suppliers-response';

export class SupplierAssembler implements BaseAssembler<Supplier, SupplierResource, SuppliersResponse> {
  toEntitiesFromResponse(response: SuppliersResponse): Supplier[] {
    return response.suppliers.map((resource) =>
      this.toEntityFromResource(resource as SupplierResource),
    );
  }

  toEntityFromResource(resource: SupplierResource): Supplier {
    return new Supplier({
      id: resource.id,
      name: resource.name,
      email: resource.email ?? '',
    });
  }

  toResourceFromEntity(entity: Supplier): SupplierResource {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
    } as SupplierResource;
  }
}
