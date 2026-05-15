import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IamStore } from '../../../application/iam.store';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  submitted = false;

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
        this.router.navigate(['/dashboard']);
      }
    });
  }

  get errors() {
    return {
      email: this.submitted && !this.email.includes('@'),
      password: this.submitted && !this.password
    };
  }

  handleLogin(): void {
    this.submitted = true;
    if (!this.email.includes('@') || !this.password) {
      return;
    }
    this.errorMessage = '';
    this.iamStore.login(this.email, this.password);
  }
}
