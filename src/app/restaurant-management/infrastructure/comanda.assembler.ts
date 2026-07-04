import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Comanda, ComandaItem } from '../domain/model/comanda.entity';
import { ComandaItemResource, ComandaResource, ComandaResponse } from './comanda-response';

export class ComandaAssembler implements BaseAssembler<Comanda, ComandaResource, ComandaResponse> {

  /**
   * Converts a ComandaResponse to an array of Comanda entities.
   * @param response - The API response containing comandas.
   * @returns An array of Comanda entities.
   */
  toEntitiesFromResponse(response: ComandaResponse): Comanda[] {
    return response.comandas.map((resource) =>
      this.toEntityFromResource(resource as ComandaResource)
    );
  }

  toEntityFromResource(resource: ComandaResource): Comanda {
    const now = new Date().toISOString();

    return new Comanda({
      id: resource.id ?? null,
      tableId: resource.tableId,
      tableNumber: resource.tableNumber ?? 0,
      items: Array.isArray(resource.items)
        ? resource.items.map((item) => new ComandaItem({
            id: (item.id as number) ?? 0,
            dishName: item.dishName,
            quantity: item.quantity
          }))
        : [],
      status: resource.status as Comanda['status'],
      createdAt: resource.createdAt ?? now,
      updatedAt: resource.updatedAt ?? resource.createdAt ?? now
    });
  }

  toResourceFromEntity(entity: Comanda): ComandaResource {
    return {
      id: entity.id,
      tableId: entity.tableId,
      items: entity.items.map((item) => this.toItemResource(item)),
      status: entity.status
    };
  }

  private toItemResource(item: ComandaItem): ComandaItemResource {
    return {
      id: item.id,
      dishName: item.dishName,
      quantity: item.quantity
    };
  }
}
