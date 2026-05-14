import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Comanda } from '../domain/model/comanda.entity';
import { ComandaAssembler } from './comanda.assembler';
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
      `${environment.platformApiBaseUrl}${environment.comandasEndpointPath}`,
      new ComandaAssembler()
    );
  }
}
