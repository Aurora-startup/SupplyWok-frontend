import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Sensor} from '../domain/model/sensor.entity';
import {SensorResource, SensorResponse} from './sensor-response';

function toBackendSensorType(type: string | null | undefined): string {
  switch ((type ?? '').trim().toLowerCase()) {
    case 'kitchen-temperature':
    case 'storage-temperature':
    case 'temperature':
      return 'Temperature';
    case 'humidity':
      return 'Humidity';
    case 'table-pressure':
    case 'storage-pressure':
    case 'weight':
      return 'Weight';
    default:
      return type || 'Temperature';
  }
}

function toDomainSensorType(resource: SensorResource): string {
  const type = toBackendSensorType(resource.type);
  const name = resource.name.toLowerCase();

  if (type === 'Temperature') {
    return name.includes('storage') || name.includes('almacen') || name.includes('almacén')
      ? 'storage-temperature'
      : 'kitchen-temperature';
  }

  if (type === 'Weight') {
    return name.includes('storage') || name.includes('almacen') || name.includes('almacén')
      ? 'storage-pressure'
      : 'table-pressure';
  }

  return type.toLowerCase();
}

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
      type: toDomainSensorType(resource)
    });
  }

  /**
   * Transforms a domain entity back into a resource format suitable for API requests (e.g., POST/PUT).
   * @param entity The domain entity to convert.
   * @returns A SensorResource DTO.
   */
  toResourceFromEntity(entity: Sensor): SensorResource {
    const resource: any = {
      name: entity.name,
      minValue: entity.minValue,
      maxValue: entity.maxValue,
      enabled: entity.enabled,
      lastValue: entity.lastValue,
      type: toBackendSensorType(entity.type)
    };
    if (entity.id) {
      resource.id = entity.id;
    }
    return resource as SensorResource;
  }
}
