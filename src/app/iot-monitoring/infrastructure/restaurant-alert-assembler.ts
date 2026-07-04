import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RestaurantAlert, RestaurantAlertSeverity, RestaurantAlertStatus } from '../domain/model/restaurant-alert.entity';
import { RestaurantAlertResource, RestaurantAlertResponse } from './restaurant-alerts-response';

export class RestaurantAlertAssembler implements BaseAssembler<RestaurantAlert, RestaurantAlertResource, RestaurantAlertResponse> {
  toEntityFromResource(resource: RestaurantAlertResource): RestaurantAlert {
    let dateVal: Date;
    const rawTimestamp = resource.timestamp || resource.createdAt || (resource as any).date;
    if (rawTimestamp) {
      dateVal = new Date(rawTimestamp);
      if (isNaN(dateVal.getTime())) {
        dateVal = new Date();
      }
    } else {
      dateVal = new Date();
    }

    let severityStr = resource.severity || 'Low';
    severityStr = severityStr.toUpperCase();
    let mappedSeverity: RestaurantAlertSeverity = 'Low';
    if (severityStr === 'CRITICAL') mappedSeverity = 'Critical';
    else if (severityStr === 'HIGH') mappedSeverity = 'High';
    else if (severityStr === 'MEDIUM') mappedSeverity = 'Medium';
    else if (severityStr === 'LOW') mappedSeverity = 'Low';
    else {
      mappedSeverity = (severityStr.charAt(0).toUpperCase() + severityStr.slice(1).toLowerCase()) as RestaurantAlertSeverity;
    }

    let statusStr = resource.status || 'Open';
    statusStr = statusStr.toUpperCase();
    let mappedStatus: RestaurantAlertStatus = 'Open';
    if (statusStr === 'PENDING' || statusStr === 'OPEN') mappedStatus = 'Open';
    else if (statusStr === 'ACKNOWLEDGED') mappedStatus = 'Acknowledged';
    else if (statusStr === 'RESOLVED') mappedStatus = 'Resolved';
    else {
      mappedStatus = (statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase()) as RestaurantAlertStatus;
    }

    const title = resource.titleKey || resource.detail || 'Unknown Alert';
    const message = resource.messageKey || resource.detail || '';
    const source = resource.source || resource.sensorName || 'Unknown';

    return new RestaurantAlert({
      id: resource.id,
      sensorId: resource.sensorId,
      titleKey: title,
      messageKey: message,
      messageParams: resource.messageParams || {},
      severity: mappedSeverity,
      status: mappedStatus,
      source: source,
      timestamp: dateVal
    });
  }

  toResourceFromEntity(entity: RestaurantAlert): RestaurantAlertResource {
    return {
      id: entity.id,
      sensorId: entity.sensorId,
      titleKey: entity.titleKey,
      messageKey: entity.messageKey,
      messageParams: entity.messageParams,
      severity: entity.severity.toUpperCase(),
      status: entity.status === 'Open' ? 'PENDING' : entity.status.toUpperCase(),
      source: entity.source,
      timestamp: entity.timestamp.toISOString(),
      detail: entity.titleKey,
      sensorName: entity.source,
      createdAt: entity.timestamp.toISOString()
    };
  }

  toEntitiesFromResponse(response: RestaurantAlertResponse): RestaurantAlert[] {
    if (!response.alerts) return [];
    return response.alerts.map(resource => this.toEntityFromResource(resource));
  }
}
