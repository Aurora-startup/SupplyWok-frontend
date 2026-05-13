import { HttpClient } from '@angular/common/http';

export abstract class BaseApi {
  // No methods defined; child classes will compose endpoint instances
  protected constructor(protected readonly http: HttpClient) {}
}
