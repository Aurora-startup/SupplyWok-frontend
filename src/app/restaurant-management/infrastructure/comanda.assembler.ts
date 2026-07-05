import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ComandaStatus } from '../domain/enums/comanda-status.enum';
import { Comanda, ComandaItem } from '../domain/model/comanda.entity';
import { ComandaItemResource, ComandaResource, ComandaResponse } from './comanda-response';

export function toDomainComandaStatus(status: string | null | undefined): ComandaStatus {
  switch (status) {
    case 'OPEN':
    case 'SENT_TO_KITCHEN':
      return ComandaStatus.EN_COLA;
    case 'IN_PREPARATION':
      return ComandaStatus.EN_PREPARACION;
    case 'SERVED':
      return ComandaStatus.LISTO;
    case 'CLOSED':
      return ComandaStatus.ENTREGADO;
    default:
      return ComandaStatus.EN_COLA;
  }
}

export function toBackendComandaStatus(status: ComandaStatus | string): string {
  switch (status) {
    case ComandaStatus.EN_COLA:
      return 'OPEN';
    case ComandaStatus.EN_PREPARACION:
      return 'IN_PREPARATION';
    case ComandaStatus.LISTO:
      return 'SERVED';
    case ComandaStatus.ENTREGADO:
      return 'CLOSED';
    default:
      return String(status);
  }
}

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
            dishName: item.dishName ?? item.productName ?? '',
            quantity: item.quantity
          }))
        : [],
      status: toDomainComandaStatus(resource.status),
      createdAt: resource.createdAt ?? now,
      updatedAt: resource.updatedAt ?? resource.createdAt ?? now
    });
  }

  toResourceFromEntity(entity: Comanda): ComandaResource {
    return {
      id: entity.id,
      tableId: entity.tableId,
      items: entity.items.map((item) => this.toItemResource(item)),
      status: toBackendComandaStatus(entity.status)
    };
  }

  private toItemResource(item: ComandaItem): ComandaItemResource {
    return {
      id: item.id,
      dishName: item.dishName,
      productName: item.dishName,
      quantity: item.quantity
    };
  }
}
