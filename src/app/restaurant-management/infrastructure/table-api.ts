import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table, TableStatus } from '../domain/model/table.entity';
import { TableApiEndpoint } from './table-api-endpoint';

@Injectable({ providedIn: 'root' })
export class TableApi {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Table[]> {
    return this.http.get<Table[]>(TableApiEndpoint.BASE);
  }

  getById(id: number): Observable<Table> {
    return this.http.get<Table>(TableApiEndpoint.byId(id));
  }

  updateStatus(id: number, status: TableStatus): Observable<Table> {
    return this.http.patch<Table>(TableApiEndpoint.byId(id), { status });
  }
}
