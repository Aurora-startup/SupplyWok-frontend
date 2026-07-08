import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '../../../iam/application/iam.store';
import { AppRoleScope, getRoleFromPath, normalizeRole } from '../../../shared/application/role-routing';
import { ProfileStore } from '../../application/profile.store';
import { Profile } from '../../domain/model/profile.entity';

@Component({
  selector: 'app-profile-settings-page',
  imports: [CommonModule, FormsModule, MatButtonModule, TranslateModule],
  template: `
    <section class="profile-settings-page">
      <header class="profile-settings-page__header">
        <span class="profile-settings-page__kicker">{{ translationPrefix() + '.kicker' | translate }}</span>
        <h1>{{ translationPrefix() + '.title' | translate }}</h1>
        <p>{{ translationPrefix() + '.description' | translate }}</p>
      </header>

      <form class="profile-settings-card" (ngSubmit)="save()">
        <div class="profile-settings-card__header">
          <h2>{{ translationPrefix() + '.profileTitle' | translate }}</h2>
          <button type="submit" mat-flat-button [disabled]="store.loading()">
            {{ (store.loading() ? 'profiles.settings.actions.saving' : 'profiles.settings.actions.save') | translate }}
          </button>
        </div>

        <label class="profile-field profile-field--full">
          <span>{{ translationPrefix() + '.fields.businessName' | translate }}</span>
          <input name="businessName" [(ngModel)]="formModel.businessName" autocomplete="organization" />
        </label>

        <div class="profile-settings-card__row">
          <label class="profile-field">
            <span>{{ 'profiles.settings.fields.firstName' | translate }}</span>
            <input name="firstName" [(ngModel)]="formModel.firstName" autocomplete="given-name" />
          </label>

          <label class="profile-field">
            <span>{{ 'profiles.settings.fields.lastName' | translate }}</span>
            <input name="lastName" [(ngModel)]="formModel.lastName" autocomplete="family-name" />
          </label>
        </div>

        <label class="profile-field profile-field--full">
          <span>{{ 'profiles.settings.fields.email' | translate }}</span>
          <input name="email" [(ngModel)]="formModel.email" autocomplete="email" type="email" readonly />
        </label>

        <div class="profile-settings-card__row">
          <label class="profile-field">
            <span>{{ 'profiles.settings.fields.street' | translate }}</span>
            <input name="street" [(ngModel)]="formModel.street" autocomplete="address-line1" />
          </label>

          <label class="profile-field">
            <span>{{ 'profiles.settings.fields.district' | translate }}</span>
            <input name="district" [(ngModel)]="formModel.district" />
          </label>
        </div>

        <div class="profile-settings-card__row">
          <label class="profile-field">
            <span>{{ 'profiles.settings.fields.city' | translate }}</span>
            <input name="city" [(ngModel)]="formModel.city" autocomplete="address-level2" />
          </label>

          <label class="profile-field">
            <span>{{ 'profiles.settings.fields.country' | translate }}</span>
            <input name="country" [(ngModel)]="formModel.country" autocomplete="country-name" />
          </label>
        </div>

        <label class="profile-field profile-field--full">
          <span>{{ 'profiles.settings.fields.supportContact' | translate }}</span>
          <input name="supportContact" [(ngModel)]="formModel.supportContact" autocomplete="tel" />
        </label>

        <div class="profile-settings-card__footer">
          <label class="profile-toggle">
            <input name="emailNotifications" [(ngModel)]="formModel.emailNotifications" type="checkbox" />
            <span class="profile-toggle__track"></span>
            <span>{{ 'profiles.settings.fields.emailNotifications' | translate }}</span>
          </label>

          <label class="profile-toggle">
            <input name="smsNotifications" [(ngModel)]="formModel.smsNotifications" type="checkbox" />
            <span class="profile-toggle__track"></span>
            <span>{{ 'profiles.settings.fields.smsNotifications' | translate }}</span>
          </label>
        </div>
      </form>

      @if (store.error()) {
        <p class="profile-settings-page__message profile-settings-page__message--error">
          {{ 'profiles.settings.messages.error' | translate }}
        </p>
      }

      @if (store.saved()) {
        <p class="profile-settings-page__message">
          {{ 'profiles.settings.messages.saved' | translate }}
        </p>
      }
    </section>
  `,
  styles: [`
    .profile-settings-page { display: flex; flex-direction: column; gap: 18px; max-width: 1076px; }
    .profile-settings-page__header { display: grid; gap: 8px; }
    .profile-settings-page__kicker { color: #a07832; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .profile-settings-page__header h1 { margin: 0; color: #342923; font-size: clamp(2rem, 2.2vw, 2.45rem); line-height: 1.05; font-weight: 800; }
    .profile-settings-page__header p { margin: 0; color: #65594f; font-size: 1rem; line-height: 1.55; }
    .profile-settings-card { display: grid; gap: 18px; padding: 20px; border: 1px solid #dfcdbb; border-radius: 8px; background: #fffdfb; box-shadow: var(--sw-shadow-soft); }
    .profile-settings-card__header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .profile-settings-card__header h2 { margin: 0; color: #151221; font-size: 1.12rem; font-weight: 800; }
    .profile-settings-card__header button { min-width: 78px; min-height: 42px; border-radius: 8px; background: #2d241e; color: #ffffff; font-family: 'Poppins', system-ui, sans-serif !important; font-weight: 800; letter-spacing: 0; }
    .profile-settings-card__header button:disabled { background: #9e9996; cursor: wait; }
    .profile-settings-card__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .profile-field { display: grid; gap: 8px; color: #57493f; font-size: 0.95rem; font-weight: 500; }
    .profile-field input { width: 100%; min-height: 48px; padding: 0 14px; border: 1px solid #dfcdbb; border-radius: 8px; background: #ffffff; color: #332820; font: inherit; outline: none; }
    .profile-field input:focus { border-color: #b8863c; box-shadow: 0 0 0 3px rgba(184, 134, 60, 0.14); }
    .profile-settings-card__footer { display: flex; flex-wrap: wrap; align-items: center; gap: 26px; padding-top: 8px; }
    .profile-toggle { display: inline-flex; align-items: center; gap: 10px; color: #3f342d; font-size: 0.95rem; cursor: pointer; }
    .profile-toggle input { position: absolute; opacity: 0; pointer-events: none; }
    .profile-toggle__track { position: relative; width: 34px; height: 22px; border-radius: 999px; background: #d8d4d0; transition: background 0.2s ease; }
    .profile-toggle__track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #ffffff; transition: transform 0.2s ease; }
    .profile-toggle input:checked + .profile-toggle__track { background: #d0180c; }
    .profile-toggle input:checked + .profile-toggle__track::after { transform: translateX(12px); }
    .profile-settings-page__message { margin: 0; padding: 14px 16px; border-radius: 10px; background: #fef4dc; color: #83560c; font-weight: 700; }
    .profile-settings-page__message--error { background: #fff0ed; color: #a32619; }
    @media (max-width: 760px) {
      .profile-settings-page__header h1 { font-size: 2rem; }
      .profile-settings-page__header p { font-size: 1rem; }
      .profile-settings-card { padding: 20px; }
      .profile-settings-card__row { grid-template-columns: 1fr; }
      .profile-settings-card__header { align-items: flex-start; }
    }
  `]
})
export class ProfileSettingsPageComponent implements OnInit {
  protected readonly store = inject(ProfileStore);
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  protected formModel = new Profile({ profileType: this.activeProfileType() });
  protected readonly translationPrefix = computed(() => `profiles.settings.${this.activeProfileType()}`);

  constructor() {
    effect(() => {
      const profile = this.store.profile();
      if (profile && profile.profileType === this.activeProfileType()) {
        this.formModel = profile.clone();
        this.ensureAccountEmail();
      }
    });
  }

  ngOnInit(): void {
    this.store.loadProfile(this.activeProfileType(), this.currentAccountEmail());
  }

  protected save(): void {
    this.formModel.profileType = this.activeProfileType();
    this.ensureAccountEmail();
    this.store.updateProfile(this.formModel.clone(), this.currentAccountEmail());
  }

  private activeProfileType(): AppRoleScope {
    return getRoleFromPath(this.router.url) ?? normalizeRole(this.iamStore.currentUserRole()) ?? 'restaurant';
  }

  private currentAccountEmail(): string {
    return this.iamStore.currentUser()?.email ?? '';
  }

  private ensureAccountEmail(): void {
    const accountEmail = this.currentAccountEmail();
    if (accountEmail) {
      this.formModel.email = accountEmail;
    }
  }
}
