import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Supplier } from '../domain/model/supplier.entity';
import { SuppliersResponse, SupplierResource } from './suppliers-response';

export class SupplierAssembler implements BaseAssembler<Supplier, SupplierResource, SuppliersResponse> {
  /**
   * Converts a CategoriesResponse to an array of Category entities.
   * @param response - The API response containing categories.
   * @returns An array of Category entities.
   */
  toEntitiesFromResponse(response: SuppliersResponse): Supplier[] {
    return response.categories.map((resource) =>
      this.toEntityFromResource(resource as SupplierResource),
    );
  }

  /**
   * Converts a CategoryResource to a Category entity.
   * @param resource - The resource to convert.
   * @returns The converted Category entity.
   */
  toEntityFromResource(resource: SupplierResource): Supplier {
    return new Supplier({
      id: resource.id,
      name: resource.name,
    });
  }

  /**
   * Converts a Category entity to a CategoryResource.
   * @param entity - The entity to convert.
   * @returns The converted CategoryResource.
   */
  toResourceFromEntity(entity: Supplier): SupplierResource {
    return {
      id: entity.id,
      name: entity.name,
    } as SupplierResource;
  }
}
