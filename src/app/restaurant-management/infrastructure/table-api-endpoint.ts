import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Table } from '../domain/model/table.entity';
import { TableAssembler, toBackendTableStatus } from './table.assembler';
import { TableResource, TableResponse } from './table-response';

export class TableApiEndpoint extends BaseApiEndpoint<
  Table,
  TableResource,
  TableResponse,
  TableAssembler
> {
  /**
   * Creates an instance of TableApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.supplyWokPlatformBaseUrl}${environment.tablesEndpointPath}`,
      new TableAssembler()
    );
  }

  override create(entity: Table): Observable<Table> {
    return this.http.post<TableResource>(this.endpointUrl, {
      number: entity.number,
      capacity: entity.capacity,
    }).pipe(
      map((created) => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create table'))
    );
  }

  updateDetails(entity: Table, id: number | string): Observable<Table> {
    return this.http.put<TableResource>(`${this.endpointUrl}/${id}`, {
      number: entity.number,
      capacity: entity.capacity,
    }).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update table'))
    );
  }

  override update(entity: Table, id: number | string): Observable<Table> {
    return this.http.put<TableResource>(`${this.endpointUrl}/${id}/status`, {
      status: toBackendTableStatus(entity.status),
    }).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update table status'))
    );
  }
}
