import { HttpClient } from '@angular/common/http';

export abstract class BaseApi {
  protected constructor(protected readonly http: HttpClient) {}
}
