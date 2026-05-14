import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Data Transfer Object representing the API response for multiple sensors.
 * Extends BaseResponse to match the standard API communication contract.
 */
export interface SensorResponse extends BaseResponse {
  /** The collection of sensor resources returned by the server */
  sensors: SensorResource[];
}

/**
 * Data Transfer Object representing an individual sensor resource from the API.
 * Maps directly to the JSON structure stored in the database.
 */
export interface SensorResource extends BaseResource {
  /** Unique database identifier */
  id: number;
  /** Label/Location name */
  name: string;
  /** Configured lower bound threshold */
  minValue: number;
  /** Configured upper bound threshold */
  maxValue: number;
  /** Active status flag */
  enabled: boolean;
  /** Last recorded measurement value */
  lastValue: number;
  /** SensorEntity category identifier */
  type: string;
}
