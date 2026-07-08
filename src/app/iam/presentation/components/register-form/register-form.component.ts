import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { IamStore } from '../../../application/iam.store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { UserRole } from '../../../domain/model/user.entity';
import { resolveHomeRoute } from '../../routing/home-route';
import { ProfileApi } from '../../../../profile-management/infrastructure/profile-api';
import { Profile } from '../../../../profile-management/domain/model/profile.entity';
import { AppRoleScope } from '../../../../shared/application/role-routing';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    CheckboxModule
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  email = '';
  password = '';
  role: UserRole | null = null;
  businessName = '';
  firstName = '';
  lastName = '';
  street = '';
  district = '';
  city = '';
  country = '';
  supportContact = '';
  termsAccepted = false;

  loading = false;
  errorMessage = '';
  submitted = false;

  roles = [
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Supplier', value: 'Supplier' }
  ];

  landingUrl = 'https://aurora-aplicacionesweb.github.io/SupplyWok-Landing-Page/';
  private pendingRegistrationProfile: Profile | null = null;
  protected profileCreationInProgress = false;
  private profileCreated = false;

  constructor(
    private router: Router,
    private iamStore: IamStore,
    private profileApi: ProfileApi
  ) {
    effect(() => {
      this.loading = this.iamStore.loading();
      const error = this.iamStore.error();
      if (error) {
        this.errorMessage = error;
      }
      if (this.iamStore.isAuthenticated() && !this.loading) {
        const homeRoute = resolveHomeRoute(this.iamStore.currentUserRole());
        if (!homeRoute) {
          this.iamStore.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        if (this.pendingRegistrationProfile && !this.profileCreated) {
          this.createRegistrationProfile(homeRoute);
          return;
        }

        void this.router.navigateByUrl(homeRoute);
      }
    });
  }

  get errors() {
    return {
      email: this.submitted && !this.email.includes('@'),
      password: this.submitted && this.password.length < 8,
      role: this.submitted && !this.role,
      businessName: this.submitted && !this.businessName.trim(),
      firstName: this.submitted && !this.firstName.trim(),
      lastName: this.submitted && !this.lastName.trim(),
      street: this.submitted && !this.street.trim(),
      district: this.submitted && !this.district.trim(),
      city: this.submitted && !this.city.trim(),
      country: this.submitted && !this.country.trim(),
      supportContact: this.submitted && !this.supportContact.trim(),
      terms: this.submitted && !this.termsAccepted
    };
  }

  get isFormValid(): boolean {
    return this.email.includes('@') &&
           this.password.length >= 8 &&
           this.role !== null &&
           this.businessName.trim().length > 0 &&
           this.firstName.trim().length > 0 &&
           this.lastName.trim().length > 0 &&
           this.street.trim().length > 0 &&
           this.district.trim().length > 0 &&
           this.city.trim().length > 0 &&
           this.country.trim().length > 0 &&
           this.supportContact.trim().length > 0 &&
           this.termsAccepted;
  }

  handleRegister(): void {
    this.submitted = true;
    if (!this.isFormValid) {
      return;
    }
    this.errorMessage = '';
    this.profileCreated = false;
    this.pendingRegistrationProfile = this.createProfileFromForm();

    this.iamStore.signUp(
      new SignUpCommand({
        email: this.email,
        password: this.password,
        role: this.role!,
      }),
    );
  }

  private createProfileFromForm(): Profile {
    return new Profile({
      profileType: this.getProfileType(),
      businessName: this.businessName.trim(),
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      street: this.street.trim(),
      district: this.district.trim(),
      city: this.city.trim(),
      country: this.country.trim(),
      supportContact: this.supportContact.trim(),
      emailNotifications: true,
      smsNotifications: false,
    });
  }

  private getProfileType(): AppRoleScope {
    return this.role === 'Supplier' ? 'supplier' : 'restaurant';
  }

  private createRegistrationProfile(homeRoute: string): void {
    if (!this.pendingRegistrationProfile || this.profileCreationInProgress) {
      return;
    }

    const accountEmail = this.iamStore.currentUser()?.email ?? this.email.trim();
    const profile = this.pendingRegistrationProfile.clone();
    profile.email = accountEmail;
    profile.profileType = this.getProfileType();
    this.profileCreationInProgress = true;
    this.profileApi.updateProfileForAccount(profile, accountEmail).subscribe({
      next: () => this.finishRegistration(homeRoute),
      error: () => {
        this.errorMessage = 'Account created, but profile settings could not be saved.';
        this.profileCreationInProgress = false;
      },
    });
  }

  private finishRegistration(homeRoute: string): void {
    this.profileCreated = true;
    this.pendingRegistrationProfile = null;
    this.profileCreationInProgress = false;
    void this.router.navigateByUrl(homeRoute);
  }
}
