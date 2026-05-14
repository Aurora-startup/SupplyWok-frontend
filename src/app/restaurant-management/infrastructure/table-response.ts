import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for a list of tables.
 */
export interface TableResponse extends BaseResponse {
  tables: TableResource[];
}

/**
 * Represents the API resource/DTO for a table.
 */
export interface TableResource extends BaseResource {
  number: number;
  capacity: number;
  status: string;
  zone: string;
  dwellTime: number;
  sensorState: string;
}
