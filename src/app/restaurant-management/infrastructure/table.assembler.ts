import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Table } from '../domain/model/table.entity';
import { TableResource, TableResponse } from './table-response';

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
    return new Table({
      id: resource.id ?? null,
      number: resource.number,
      capacity: resource.capacity,
      status: resource.status as Table['status'],
      zone: resource.zone,
      dwellTime: resource.dwellTime,
      sensorState: resource.sensorState as Table['sensorState']
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
      status: entity.status,
      zone: entity.zone,
      dwellTime: entity.dwellTime,
      sensorState: entity.sensorState
    };
  }
}
