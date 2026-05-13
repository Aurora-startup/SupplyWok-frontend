import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Comanda, ComandaItem } from '../domain/model/comanda.entity';
import { ComandaItemResource, ComandaResource, ComandaResponse } from './comanda-response';

export class ComandaAssembler extends BaseAssembler<Comanda, ComandaResource, ComandaResponse> {

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
    return new Comanda({
      id: resource.id ?? null,
      tableId: resource.tableId,
      tableNumber: resource.tableNumber,
      items: Array.isArray(resource.items)
        ? resource.items.map((item) => new ComandaItem({
            id: item.id as number ?? 0,
            dishName: item.dishName,
            quantity: item.quantity
          }))
        : [],
      status: resource.status as Comanda['status'],
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt
    });
  }

  toResourceFromEntity(entity: Comanda): ComandaResource {
    return {
      id: entity.id,
      tableId: entity.tableId,
      tableNumber: entity.tableNumber,
      items: entity.items.map((item) => this.toItemResource(item)),
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
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
