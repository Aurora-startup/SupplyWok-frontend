import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppRoleScope } from '../../shared/application/role-routing';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Profile } from '../domain/model/profile.entity';
import { ProfileApiEndpoint } from './profile-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi extends BaseApi {
  private readonly profileEndpoint: ProfileApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.profileEndpoint = new ProfileApiEndpoint(http);
  }

  getProfile(profileType: AppRoleScope): Observable<Profile> {
    return this.profileEndpoint.getByType(profileType);
  }

  getProfileByAccountEmail(profileType: AppRoleScope, email: string): Observable<Profile> {
    return this.profileEndpoint.getByAccountEmail(profileType, email);
  }

  getProfilesByType(profileType: AppRoleScope): Observable<Profile[]> {
    return this.profileEndpoint.getAllByType(profileType);
  }

  updateProfile(profile: Profile): Observable<Profile> {
    return this.profileEndpoint.updateProfile(profile);
  }

  updateProfileForAccount(profile: Profile, accountEmail: string): Observable<Profile> {
    return this.profileEndpoint.updateProfileForAccount(profile, accountEmail);
  }
}
