import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Client } from '../domain/model/client.entity';
import { ClientAssembler } from './client-assembler';
import { ClientResource, ClientsResponse } from './supplier-management-response';

export class ClientsApiEndpoint extends BaseApiEndpoint<Client, ClientResource, ClientsResponse, ClientAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplierGetApiBaseUrl}${environment.supplierClientsEndpointPath}`, new ClientAssembler());
  }
}
