import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CatalogItem } from '../domain/model/catalog-item.entity';
import { CatalogItemResource, CatalogItemsResponse } from './supplier-management-response';

export class CatalogItemAssembler extends BaseAssembler<CatalogItem, CatalogItemResource, CatalogItemsResponse> {
  toEntityFromResource(resource: CatalogItemResource): CatalogItem {
    return new CatalogItem({
      id: resource.id ?? null,
      name: resource.name ?? '',
      category: resource.category ?? '',
      price: Number(resource.price ?? 0),
      unit: resource.unit ?? '',
      deliveryConditions: resource.deliveryConditions ?? ''
    });
  }

  toResourceFromEntity(entity: CatalogItem): CatalogItemResource {
    return {
      id: entity.id,
      name: entity.name,
      category: entity.category,
      price: entity.price,
      unit: entity.unit,
      deliveryConditions: entity.deliveryConditions
    };
  }

  toEntitiesFromResponse(response: CatalogItemsResponse): CatalogItem[] {
    const resources = response.catalogItems ?? response['catalog-items'] ?? [];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
