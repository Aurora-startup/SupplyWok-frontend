import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, concatMap, map, reduce } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Comanda } from '../domain/model/comanda.entity';
import { ComandaAssembler, toBackendComandaStatus } from './comanda.assembler';
import { ComandaResource, ComandaResponse } from './comanda-response';

export class ComandaApiEndpoint extends BaseApiEndpoint<
  Comanda,
  ComandaResource,
  ComandaResponse,
  ComandaAssembler
> {
  /**
   * Creates an instance of ComandaApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.supplyWokPlatformBaseUrl}${environment.comandasEndpointPath}`,
      new ComandaAssembler()
    );
  }

  override create(entity: Comanda): Observable<Comanda> {
    return this.http.post<ComandaResource>(this.endpointUrl, { tableId: entity.tableId }).pipe(
      concatMap((created) => {
        if (!entity.items.length || created.id == null) {
          return of(created);
        }

        return from(entity.items).pipe(
          concatMap((item) =>
            this.http.post<ComandaResource>(`${this.endpointUrl}/${created.id}/items`, {
              productName: item.dishName,
              quantity: item.quantity,
              notes: '',
            })
          ),
          reduce((_, current) => current, created)
        );
      }),
      map((created) => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create comanda'))
    );
  }

  override update(entity: Comanda, id: number | string): Observable<Comanda> {
    return this.http.put<ComandaResource>(`${this.endpointUrl}/${id}/status`, {
      status: toBackendComandaStatus(entity.status),
    }).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update comanda status'))
    );
  }
}
