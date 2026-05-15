import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { UnitOfMeasure } from '../domain/enums/unit-of-measure.enum';
import { InventoryItemsResponse, ItemResource } from './inventory-items-response';

export class InventoryItemAssembler implements BaseAssembler<
  InventoryItem,
  ItemResource,
  InventoryItemsResponse
> {
  /**
   * Converts a CategoriesResponse to an array of Category entities.
   * @param response - The API response containing categories.
   * @returns An array of Category entities.
   */
  toEntitiesFromResponse(response: InventoryItemsResponse): InventoryItem[] {
    return response.inventoryItems.map((resource) =>
      this.toEntityFromResource(resource as ItemResource),
    );
  }

  /**
   * Converts a CategoryResource to a Category entity.
   * @param resource - The resource to convert.
   * @returns The converted Category entity.
   */
  toEntityFromResource(resource: ItemResource): InventoryItem {
    return new InventoryItem({
      id: resource.id,
      name: resource.name,
      currentStock: resource.currentStock,
      minimumStockLevel: resource.minimumStockLevel,
      unitOfMeasure: resource.unitOfMeasure as UnitOfMeasure,
      idCategory: resource.idCategory,
      idSupplier: resource.idSupplier,
    });
  }

  /**
   * Converts a Category entity to a CategoryResource.
   * @param entity - The entity to convert.
   * @returns The converted CategoryResource.
   */
  toResourceFromEntity(entity: InventoryItem): ItemResource {
    return {
      id: entity.id,
      name: entity.name,
      currentStock: entity.currentStock,
      minimumStockLevel: entity.minimumStockLevel,
      unitOfMeasure: entity.unitOfMeasure,
      idCategory: entity.idCategory,
      idSupplier: entity.idSupplier,
    } as ItemResource;
  }
}
