import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppRoleScope } from '../../shared/application/role-routing';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Profile } from '../domain/model/profile.entity';
import { ProfileAssembler } from './profile-assembler';
import { ProfileResource, ProfileResponse } from './profile-response';

export class ProfileApiEndpoint extends BaseApiEndpoint<Profile, ProfileResource, ProfileResponse, ProfileAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.supplyWokPlatformBaseUrl}${environment.profilesEndpointPath}`, new ProfileAssembler());
  }

  getByType(profileType: AppRoleScope): Observable<Profile> {
    return this.http.get<ProfileResource>(`${this.endpointUrl}/${profileType}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch profile'))
    );
  }

  getByAccountEmail(profileType: AppRoleScope, email: string): Observable<Profile> {
    return this.http.get<ProfileResource>(`${this.endpointUrl}/${profileType}/accounts/by-email`, {
      params: { email },
    }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch profile'))
    );
  }

  getAllByType(profileType: AppRoleScope): Observable<Profile[]> {
    return this.http.get<ProfileResource[]>(`${this.endpointUrl}/${profileType}/accounts`).pipe(
      map((resources) => resources.map((resource) => this.assembler.toEntityFromResource(resource))),
      catchError(this.handleError('Failed to fetch profiles'))
    );
  }

  updateProfile(profile: Profile): Observable<Profile> {
    const resource = this.assembler.toResourceFromEntity(profile);
    return this.http.put<ProfileResource>(`${this.endpointUrl}/${profile.profileType}`, resource).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update profile'))
    );
  }

  updateProfileForAccount(profile: Profile, accountEmail: string): Observable<Profile> {
    const resource = this.assembler.toResourceFromEntity(profile);
    return this.http.put<ProfileResource>(`${this.endpointUrl}/${profile.profileType}/accounts/by-email`, resource, {
      params: { email: accountEmail },
    }).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update profile'))
    );
  }
}
