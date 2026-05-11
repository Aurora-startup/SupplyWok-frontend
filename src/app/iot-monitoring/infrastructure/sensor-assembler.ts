import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Sensor} from '../domain/model/sensor.entity';
import {SensorResource, SensorResponse} from './sensor-response';

/**
 * Assembler class responsible for transforming data between the Infrastructure layer (DTOs)
 * and the Domain layer (Entities). This decoupling allows API changes without breaking
 * the domain logic.
 */
export class SensorAssembler implements BaseAssembler<Sensor, SensorResource, SensorResponse> {
  /**
   * Transforms an API response object into a collection of domain entities.
   * @param response The raw API response.
   * @returns An array of SensorEntity.
   */
  toEntitiesFromResponse(response: SensorResponse): Sensor[] {
    return response.sensors.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Transforms a single API resource (DTO) into a domain entity.
   * @param resource The raw resource data from the API.
   * @returns A new instance of SensorEntity.
   */
  toEntityFromResource(resource: SensorResource): Sensor {
    return new Sensor({
      id: resource.id,
      name: resource.name,
      minValue: resource.minValue,
      maxValue: resource.maxValue,
      enabled: resource.enabled,
      lastValue: resource.lastValue,
      type: resource.type,
    });
  }

  /**
   * Transforms a domain entity back into a resource format suitable for API requests (e.g., POST/PUT).
   * @param entity The domain entity to convert.
   * @returns A SensorResource DTO.
   */
  toResourceFromEntity(entity: Sensor): SensorResource {
    return {
      id: entity.id,
      name: entity.name,
      minValue: entity.minValue,
      maxValue: entity.maxValue,
      enabled: entity.enabled,
      lastValue: entity.lastValue,
      type: entity.type,
    } as SensorResource;
  }
}
