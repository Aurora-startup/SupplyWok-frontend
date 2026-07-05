import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Table } from '../domain/model/table.entity';
import { SensorState } from '../domain/enums/sensor-state.enum';
import { TableStatus } from '../domain/enums/table-status.enum';
import { TableResource, TableResponse } from './table-response';

export function toDomainTableStatus(status: string | null | undefined): TableStatus {
  return status === 'AVAILABLE'
    ? TableStatus.FREE
    : (status as TableStatus) ?? TableStatus.FREE;
}

export function toBackendTableStatus(status: TableStatus | string): string {
  return status === TableStatus.FREE ? 'AVAILABLE' : status;
}

export class TableAssembler implements BaseAssembler<Table, TableResource, TableResponse> {

  /**
   * Converts a TableResponse to an array of Table entities.
   * @param response - The API response containing tables.
   * @returns An array of Table entities.
   */
  toEntitiesFromResponse(response: TableResponse): Table[] {
    return response.tables.map((resource) =>
      this.toEntityFromResource(resource as TableResource)
    );
  }

  /**
   * Converts a TableResource to a Table entity.
   * @param resource - The resource to convert.
   * @returns The converted Table entity.
   */
  toEntityFromResource(resource: TableResource): Table {
    const status = toDomainTableStatus(resource.status);

    return new Table({
      id: resource.id ?? null,
      number: resource.number,
      capacity: resource.capacity,
      status,
      zone: resource.zone ?? '',
      dwellTime: resource.dwellTime ?? 0,
      sensorState: (resource.sensorState as Table['sensorState']) ?? (status === 'OCCUPIED' ? SensorState.ACTIVE : SensorState.IDLE)
    });
  }

  /**
   * Converts a Table entity to a TableResource.
   * @param entity - The entity to convert.
   * @returns The converted TableResource.
   */
  toResourceFromEntity(entity: Table): TableResource {
    return {
      id: entity.id,
      number: entity.number,
      capacity: entity.capacity,
      status: toBackendTableStatus(entity.status),
    };
  }
}
