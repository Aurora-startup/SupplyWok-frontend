import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { InventoryCategory } from '../domain/model/inventory-category.entity';
import { InventoryCategoriesResponse, CategoryResource } from './inventory-categories-response';


export class InventoryCategoryAssembler implements BaseAssembler<
  InventoryCategory,
  CategoryResource,
  InventoryCategoriesResponse
> {
  /**
   * Converts a CategoriesResponse to an array of Category entities.
   * @param response - The API response containing categories.
   * @returns An array of Category entities.
   */
  toEntitiesFromResponse(response: InventoryCategoriesResponse): InventoryCategory[] {
    return response.categories.map((resource) =>
      this.toEntityFromResource(resource as CategoryResource),
    );
  }

  /**
   * Converts a CategoryResource to a Category entity.
   * @param resource - The resource to convert.
   * @returns The converted Category entity.
   */
  toEntityFromResource(resource: CategoryResource): InventoryCategory {
    return new InventoryCategory({
      id: resource.id,
      name: resource.name,
    });
  }

  /**
   * Converts a Category entity to a CategoryResource.
   * @param entity - The entity to convert.
   * @returns The converted CategoryResource.
   */
  toResourceFromEntity(entity: InventoryCategory): CategoryResource {
    return {
      id: entity.id,
      name: entity.name,
    } as CategoryResource;
  }
}
