import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { IamStore } from '../../../application/iam.store';
import { User, UserRole, SubscriptionTier } from '../../../domain/model/user.entity';
import { resolveHomeRoute } from '../../routing/home-route';

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
  phone = '';
  role: UserRole | null = null;
  subscription: SubscriptionTier | null = null;
  termsAccepted = false;

  loading = false;
  errorMessage = '';
  submitted = false;

  roles = [
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Supplier', value: 'Supplier' }
  ];

  subscriptions = [
    { label: 'Premium', value: 'Premium' },
    { label: 'Enterprise', value: 'Enterprise' }
  ];

  landingUrl = 'https://aurora-aplicacionesweb.github.io/SupplyWok-Landing-Page/';

  constructor(
    private router: Router,
    private iamStore: IamStore,
    private translate: TranslateService
  ) {
    effect(() => {
      this.loading = this.iamStore.loading();
      const error = this.iamStore.error();
      if (error) {
        this.errorMessage = error;
      }
      if (this.iamStore.isAuthenticated()) {
        void this.router.navigateByUrl(resolveHomeRoute(this.iamStore.currentUserRole()));
      }
    });
  }

  get errors() {
    return {
      email: this.submitted && !this.email.includes('@'),
      password: this.submitted && this.password.length < 8,
      phone: this.submitted && !this.phone,
      role: this.submitted && !this.role,
      subscription: this.submitted && !this.subscription,
      terms: this.submitted && !this.termsAccepted
    };
  }

  get isFormValid(): boolean {
    return this.email.includes('@') &&
           this.password.length >= 8 &&
           this.phone.length > 0 &&
           this.role !== null &&
           this.subscription !== null &&
           this.termsAccepted;
  }

  handleRegister(): void {
    this.submitted = true;
    if (!this.isFormValid) {
      return;
    }
    this.errorMessage = '';

    const userData = new User(
      0,
      this.email,
      this.phone,
      this.role!,
      this.subscription!,
      this.password
    );

    this.iamStore.registerUser(userData);
  }
}
