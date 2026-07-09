import { Injectable, inject, signal } from '@angular/core';
import { AppRoleScope } from '../../shared/application/role-routing';
import { Profile } from '../domain/model/profile.entity';
import { ProfileApi } from '../infrastructure/profile-api';

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  private readonly profileApi = inject(ProfileApi);
  private readonly profileSignal = signal<Profile | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly savedSignal = signal(false);

  readonly profile = this.profileSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly saved = this.savedSignal.asReadonly();

  loadProfile(profileType: AppRoleScope, accountEmail?: string | null): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.savedSignal.set(false);

    const request = accountEmail
      ? this.profileApi.getProfileByAccountEmail(profileType, accountEmail)
      : this.profileApi.getProfile(profileType);

    request.subscribe({
      next: (profile) => {
        this.profileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error instanceof Error ? error.message : 'Failed to load profile');
        this.profileSignal.set(new Profile({ profileType, email: accountEmail ?? '' }));
        this.loadingSignal.set(false);
      },
    });
  }

  updateProfile(profile: Profile, accountEmail?: string | null): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.savedSignal.set(false);

    const request = accountEmail
      ? this.profileApi.updateProfileForAccount(profile, accountEmail)
      : this.profileApi.updateProfile(profile);

    request.subscribe({
      next: (updatedProfile) => {
        this.profileSignal.set(updatedProfile);
        this.savedSignal.set(true);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error instanceof Error ? error.message : 'Failed to update profile');
        this.loadingSignal.set(false);
      },
    });
  }
}
