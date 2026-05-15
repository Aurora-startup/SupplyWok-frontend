import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { UserAssembler } from './assemblers/user.assembler';

/**
 * Service class responsible for interacting with the IAM/Users API.
 */
@Injectable({
  providedIn: 'root',
})
export class IamApiService {
  private readonly baseUrl = environment.platformIotApiBaseURL;
  private readonly endpoint = environment.platformProviderUsersEndpointPath;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all users from the API.
   * @returns An Observable of User entities.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.baseUrl}${this.endpoint}`).pipe(
      map(response => UserAssembler.toEntitiesFromResponse(response)),
      catchError(error => {
        console.error('Failed to get users:', error);
        return of([]);
      })
    );
  }

  /**
   * Creates a new user in the system.
   * @param userEntity The user entity to persist.
   * @returns An Observable of the created User or null if failed.
   */
  createUser(userEntity: User): Observable<User | null> {
    const resource = UserAssembler.toResourceFromEntity(userEntity);
    return this.http.post<any>(`${this.baseUrl}${this.endpoint}`, resource).pipe(
      map(data => UserAssembler.toEntityFromResource(data)),
      catchError(error => {
        console.error('Failed to create user:', error);
        return of(null);
      })
    );
  }
}
