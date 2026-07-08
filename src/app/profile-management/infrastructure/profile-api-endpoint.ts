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

  updateProfile(profile: Profile): Observable<Profile> {
    const resource = this.assembler.toResourceFromEntity(profile);
    return this.http.put<ProfileResource>(`${this.endpointUrl}/${profile.profileType}`, resource).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update profile'))
    );
  }
}
