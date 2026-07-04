import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';

interface SignInRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  email: string;
  password: string;
  roles: string[];
}

interface AuthenticatedUserResource {
  id: number;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class IamApiService {
  private readonly endpoint = `${environment.apiBaseUrl}${environment.authenticationEndpointPath}`;

  constructor(private http: HttpClient) {}

  signIn(credentials: SignInRequest): Observable<User> {
    return this.http
      .post<AuthenticatedUserResource>(
        `${this.endpoint}${environment.authenticationSignInEndpointPath}`,
        credentials,
      )
      .pipe(map((resource) => this.toAuthenticatedUser(resource)));
  }

  signUp(payload: SignUpRequest): Observable<User> {
    return this.http
      .post<{ id: number; email: string; roles: string[] }>(
        `${this.endpoint}${environment.authenticationSignUpEndpointPath}`,
        payload,
      )
      .pipe(
        map(
          (resource) =>
            new User({
              id: resource.id,
              email: resource.email,
              roles: resource.roles,
            }),
        ),
      );
  }

  private toAuthenticatedUser(resource: AuthenticatedUserResource): User {
    return new User({
      id: resource.id,
      email: resource.email,
      roles: this.extractRolesFromToken(resource.token),
      token: resource.token,
    });
  }

  private extractRolesFromToken(token: string): string[] {
    try {
      const [, payload] = token.split('.');
      if (!payload) {
        return [];
      }

      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(normalizedPayload)) as {
        roles?: string[];
        authorities?: string[];
      };

      if (Array.isArray(decodedPayload.roles)) {
        return decodedPayload.roles;
      }

      if (Array.isArray(decodedPayload.authorities)) {
        return decodedPayload.authorities;
      }
    } catch {
      return [];
    }

    return [];
  }
}
