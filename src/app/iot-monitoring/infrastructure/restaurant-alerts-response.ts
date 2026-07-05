import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface RestaurantAlertResource extends BaseResource {
  id: number;
  sensorId: number;
  titleKey?: string;
  messageKey?: string;
  messageParams?: Record<string, any>;
  severity: string;
  status: string;
  source?: string;
  timestamp?: string;
  detail?: string;
  sensorName?: string;
  createdAt?: string;
}

export interface RestaurantAlertResponse extends BaseResponse {
  alerts: RestaurantAlertResource[];
}
