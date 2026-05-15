import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Comanda } from '../domain/model/comanda.entity';
import { ComandaApiEndpoint } from './comanda-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class ComandaApi extends BaseApi {
  private readonly comandasEndpoint: ComandaApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.comandasEndpoint = new ComandaApiEndpoint(http);
  }

  /**
   * Retrieves all comandas.
   * @returns Observable of Comanda array.
   */
  getComandas(): Observable<Comanda[]> {
    return this.comandasEndpoint.getAll();
  }

  createComanda(comanda: Comanda): Observable<Comanda> {
    return this.comandasEndpoint.create(comanda);
  }

  /**
   * Updates an existing comanda.
   * @param comanda - Comanda entity to update.
   * @returns Observable of updated Comanda.
   */
  updateComanda(comanda: Comanda): Observable<Comanda> {
    return this.comandasEndpoint.update(comanda, comanda.id!);
  }
}
