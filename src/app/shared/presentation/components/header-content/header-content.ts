import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { IamStore } from '../../../../iam/application/iam.store';
import { HeaderAlertsPopupComponent } from '../../../../iot-monitoring/presentation/components/header-alerts-popup/header-alerts-popup.component';
import { getScopedPathByRole, normalizeRole } from '../../../application/role-routing';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-header-content',
  standalone: true,
  imports: [CommonModule, MenuModule, LanguageSwitcher, TranslateModule, HeaderAlertsPopupComponent],
  templateUrl: './header-content.html',
  styleUrl: './header-content.css',
})
export class HeaderContent {
  profileItems: MenuItem[] = [];
  protected readonly alertsOpen = signal(false);
  protected readonly landingUrl = 'https://aurora-aplicacionesweb.github.io/SupplyWok-Landing-Page/';
  protected readonly activeRole = computed(() => normalizeRole(this.iamStore.currentUserRole()) ?? 'restaurant');
  protected readonly profileLabelKey = computed(() =>
    this.activeRole() === 'supplier' ? 'shared.sidebar.supplier' : 'shared.sidebar.restaurant'
  );

  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  constructor() {
    this.updateMenuTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.updateMenuTranslations();
    });
  }

  protected toggleAlerts(): void {
    this.alertsOpen.update((isOpen) => !isOpen);
  }

  private updateMenuTranslations(): void {
    this.translate.get(['shared.header.options', 'shared.header.settings', 'shared.header.logout']).subscribe((translations) => {
      this.profileItems = [
        {
          label: translations['shared.header.options'] || 'Options',
          items: [
            {
              label: translations['shared.header.settings'] || 'Settings',
              icon: 'pi pi-cog',
              command: () => void this.router.navigateByUrl(getScopedPathByRole(this.iamStore.currentUserRole(), 'configuration'))
            },
            {
              label: translations['shared.header.logout'] || 'Logout',
              icon: 'pi pi-sign-out',
              command: () => {
                this.iamStore.logout();
                this.alertsOpen.set(false);
                void this.router.navigateByUrl('/login');
              }
            }
          ]
        }
      ];
    });
  }
}
