import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { UsersAssembler } from './users-assembler';
import { UserResource } from './users-response';

const usersApiEndpointUrl = `${environment.supplyWokPlatformBaseUrl}${environment.platformProviderUsersEndpointPath}`;

/**
 * Encapsulates IAM user query HTTP operations.
 */
export class UsersApiEndpoint {
  constructor(
    private readonly http: HttpClient,
    private readonly assembler: UsersAssembler,
  ) {}

  getAll(): Observable<User[]> {
    return this.http
      .get<UserResource[]>(usersApiEndpointUrl)
      .pipe(map((resources) => this.assembler.toEntitiesFromResponse(resources)));
  }

  getById(userId: number): Observable<User> {
    return this.http
      .get<UserResource>(`${usersApiEndpointUrl}/${userId}`)
      .pipe(map((resource) => this.assembler.toEntityFromResource(resource)));
  }
}
