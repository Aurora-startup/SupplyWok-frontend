import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Table } from '../domain/model/table.entity';
import { TableApiEndpoint } from './table-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class TableApi extends BaseApi {
  private readonly tablesEndpoint: TableApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.tablesEndpoint = new TableApiEndpoint(http);
  }

  /**
   * Retrieves all tables.
   * @returns Observable of Table array.
   */
  getTables(): Observable<Table[]> {
    return this.tablesEndpoint.getAll();
  }

  getTableById(id: number): Observable<Table> {
    return this.tablesEndpoint.getById(id);
  }

  /**
   * Updates an existing table.
   * @param table - Table entity to update.
   * @returns Observable of updated Table.
   */
  updateTable(table: Table): Observable<Table> {
    return this.tablesEndpoint.update(table, table.id!);
  }
}
