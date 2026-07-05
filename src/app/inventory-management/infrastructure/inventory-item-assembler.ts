import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { InventoryCategory } from '../domain/model/inventory-category.entity';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { UnitOfMeasure } from '../domain/enums/unit-of-measure.enum';
import { InventoryItemsResponse, ItemResource } from './inventory-items-response';

export function buildCategoryId(categoryName: string | null | undefined): number {
  const normalizedName = (categoryName ?? '').trim().toLowerCase();

  if (!normalizedName) {
    return 0;
  }

  return normalizedName.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function normalizeUnitOfMeasure(unitOfMeasure: string | null | undefined): UnitOfMeasure | null {
  const normalizedUnit = unitOfMeasure?.trim().toUpperCase();

  switch (normalizedUnit) {
    case 'KILOGRAMS':
    case UnitOfMeasure.KG:
      return UnitOfMeasure.KG;
    case 'LITERS':
    case UnitOfMeasure.LTS:
      return UnitOfMeasure.LTS;
    case 'UNITS':
    case UnitOfMeasure.UNITS:
      return UnitOfMeasure.UNITS;
    default:
      return null;
  }
}

function toBackendUnitOfMeasure(unitOfMeasure: UnitOfMeasure | null): string | null {
  switch (unitOfMeasure) {
    case UnitOfMeasure.KG:
      return 'Kilograms';
    case UnitOfMeasure.LTS:
      return 'Liters';
    case UnitOfMeasure.UNITS:
      return 'Units';
    default:
      return null;
  }
}

export class InventoryItemAssembler implements BaseAssembler<
  InventoryItem,
  ItemResource,
  InventoryItemsResponse
> {
  toEntitiesFromResponse(response: InventoryItemsResponse): InventoryItem[] {
    return response.inventoryItems.map((resource) => this.toEntityFromResource(resource as ItemResource));
  }

  toEntityFromResource(resource: ItemResource): InventoryItem {
    const categoryName = resource.category?.trim() ?? '';
    const categoryId = buildCategoryId(categoryName);

    return new InventoryItem({
      id: resource.id,
      name: resource.name,
      currentStock: resource.currentStock,
      minimumStockLevel: resource.minimumStockLevel,
      unitOfMeasure: normalizeUnitOfMeasure(resource.unitOfMeasure),
      idCategory: categoryId,
      idSupplier: resource.idSupplier ?? 0,
      category: categoryName
        ? new InventoryCategory({
            id: categoryId,
            name: categoryName,
          })
        : null,
    });
  }

  toResourceFromEntity(entity: InventoryItem): ItemResource {
    return {
      id: entity.id,
      name: entity.name,
      currentStock: entity.currentStock,
      minimumStockLevel: entity.minimumStockLevel,
      unitOfMeasure: toBackendUnitOfMeasure(entity.unitOfMeasure),
      category: entity.category?.name ?? null,
    } as ItemResource;
  }
}
