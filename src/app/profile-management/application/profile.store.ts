import { Injectable, inject, signal } from '@angular/core';
import { retry } from 'rxjs';
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

  loadProfile(profileType: AppRoleScope): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.savedSignal.set(false);

    this.profileApi.getProfile(profileType).pipe(retry(2)).subscribe({
      next: (profile) => {
        this.profileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error instanceof Error ? error.message : 'Failed to load profile');
        this.profileSignal.set(new Profile({ profileType }));
        this.loadingSignal.set(false);
      },
    });
  }

  updateProfile(profile: Profile): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.savedSignal.set(false);

    this.profileApi.updateProfile(profile).pipe(retry(2)).subscribe({
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
