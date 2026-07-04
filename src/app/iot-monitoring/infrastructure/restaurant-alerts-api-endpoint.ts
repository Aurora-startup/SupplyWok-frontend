import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { RestaurantAlert } from '../domain/model/restaurant-alert.entity';
import { RestaurantAlertResource, RestaurantAlertResponse } from './restaurant-alerts-response';
import { RestaurantAlertAssembler } from './restaurant-alert-assembler';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class RestaurantAlertsApiEndpoint extends BaseApiEndpoint<RestaurantAlert, RestaurantAlertResource, RestaurantAlertResponse, RestaurantAlertAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplyWokPlatformBaseUrl}${environment.restaurantAlertsEndpointPath}`, new RestaurantAlertAssembler());
  }

  override update(entity: RestaurantAlert, id: number | string): Observable<RestaurantAlert> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.patch<RestaurantAlertResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update alert via PATCH'))
    );
  }
}
