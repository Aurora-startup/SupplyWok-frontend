import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Table } from '../domain/model/table.entity';
import { TableAssembler } from './table.assembler';
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
      `${environment.platformApiBaseUrl}${environment.tablesEndpointPath}`,
      new TableAssembler()
    );
  }
}
