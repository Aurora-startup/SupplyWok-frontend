import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comanda, ComandaStatus } from '../domain/model/comanda.entity';
import { ComandaApiEndpoint } from './comanda-api-endpoint';

@Injectable({ providedIn: 'root' })
export class ComandaApi {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Comanda[]> {
    return this.http.get<Comanda[]>(ComandaApiEndpoint.BASE);
  }

  getById(id: number): Observable<Comanda> {
    return this.http.get<Comanda>(ComandaApiEndpoint.byId(id));
  }

  create(comanda: Partial<Comanda>): Observable<Comanda> {
    return this.http.post<Comanda>(ComandaApiEndpoint.BASE, comanda);
  }

  updateStatus(id: number, status: ComandaStatus): Observable<Comanda> {
    return this.http.patch<Comanda>(ComandaApiEndpoint.byId(id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  }
}
