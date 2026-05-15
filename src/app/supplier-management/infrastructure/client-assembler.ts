import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Client } from '../domain/model/client.entity';
import { ClientResource, ClientsResponse } from './supplier-management-response';

export class ClientAssembler extends BaseAssembler<Client, ClientResource, ClientsResponse> {
  toEntityFromResource(resource: ClientResource): Client {
    return new Client({
      id: resource.id ?? null,
      name: resource.name ?? '',
      district: resource.district ?? '',
      frequency: resource.frequency ?? '',
      averageTicket: Number(resource.averageTicket ?? 0),
      demandProjectionPercent: Number(resource.demandProjectionPercent ?? 0),
      status: resource.status ?? '',
      lastOrderDate: resource.lastOrderDate ?? ''
    });
  }

  toResourceFromEntity(entity: Client): ClientResource {
    return {
      id: entity.id,
      name: entity.name,
      district: entity.district,
      frequency: entity.frequency,
      averageTicket: entity.averageTicket,
      demandProjectionPercent: entity.demandProjectionPercent,
      status: entity.status,
      lastOrderDate: entity.lastOrderDate
    };
  }

  toEntitiesFromResponse(response: ClientsResponse): Client[] {
    return (response.clients ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
