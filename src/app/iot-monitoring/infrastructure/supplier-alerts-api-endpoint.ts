import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SupplierAlert } from '../domain/model/supplier-alert.entity';
import { SupplierAlertAssembler } from './supplier-alert-assembler';
import { SupplierAlertResource, SupplierAlertsResponse } from './supplier-alerts-response';

export class SupplierAlertsApiEndpoint extends BaseApiEndpoint<SupplierAlert, SupplierAlertResource, SupplierAlertsResponse, SupplierAlertAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplyWokPlatformBaseUrl}${environment.supplierAlertsEndpointPath}`, new SupplierAlertAssembler());
  }

  override update(entity: SupplierAlert, id: number | string): Observable<SupplierAlert> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.patch<SupplierAlertResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update supplier alert via PATCH'))
    );
  }
}
