import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

export interface MenuItem {
  id: string;
  path: string;
  i18nKey: string;
  iconOff: string;
  iconOn: string;
  exact?: boolean;
}

/**
 * @component SidebarMenuComponent
 * @summary Main navigation sidebar for the Angular application, displaying the branding and main modules.
 * @author Aurora Development Team
 */
@Component({
  selector: 'app-sidebar-menu',
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.css'
})
export class SidebarMenuComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly restaurantName = computed(() => 'GRAN DRAGON CHIFA');
  readonly currentPlan = computed(() => 'Premium');

  readonly menuItems: MenuItem[] = [
    { id: 'dashboard', path: '/dashboard', i18nKey: 'shared.sidebar.dashboard', iconOff: '/assets/images/icons/dashboard-icon.svg', iconOn: '/assets/images/icons/dashboard-on-icon.svg', exact: true },
    { id: 'inventory', path: '/inventory', i18nKey: 'shared.sidebar.inventory', iconOff: '/assets/images/icons/inventory-icon.svg', iconOn: '/assets/images/icons/inventory-on-icon.svg', exact: true },
    { id: 'orders', path: '/orders', i18nKey: 'shared.sidebar.orders', iconOff: '/assets/images/icons/orders-icon.svg', iconOn: '/assets/images/icons/orders-on-icon.svg' },
    { id: 'kitchen-tickets', path: '/kitchen-tickets', i18nKey: 'shared.sidebar.kitchen-tickets', iconOff: '/assets/images/icons/kitchen-ticket-icon.svg', iconOn: '/assets/images/icons/kitchen-tickets-on-icon.svg', exact: true },
    { id: 'suppliers', path: '/suppliers', i18nKey: 'shared.sidebar.suppliers', iconOff: '/assets/images/icons/suppliers-icon.svg', iconOn: '/assets/images/icons/suppliers-on-icon.svg', exact: true },
    { id: 'tables-and-occupancy', path: '/tables-and-occupancy', i18nKey: 'shared.sidebar.tables-and-occupancy', iconOff: '/assets/images/icons/tables-and-occupancy-icon.svg', iconOn: '/assets/images/icons/tables-and-occupancy-on-icon.svg', exact: true },
    { id: 'alerts', path: '/alerts', i18nKey: 'shared.sidebar.alerts', iconOff: '/assets/images/icons/alerts-icon.svg', iconOn: '/assets/images/icons/alerts-on-icon.svg', exact: true },
    { id: 'reports', path: '/reports', i18nKey: 'shared.sidebar.reports', iconOff: '/assets/images/icons/reports-icon.svg', iconOn: '/assets/images/icons/reports-on-icon.svg', exact: true },
    { id: 'configuration', path: '/configuration', i18nKey: 'shared.sidebar.configuration', iconOff: '/assets/images/icons/configuration-icon.svg', iconOn: '/assets/images/icons/configuration-on-icon.svg', exact: true },
    { id: 'subscription', path: '/subscription', i18nKey: 'shared.sidebar.subscription', iconOff: '/assets/images/icons/subscripcion-icon.svg', iconOn: '/assets/images/icons/subscription-on-icon.svg', exact: true }
  ];

  isActive(item: MenuItem): boolean {
    const currentUrl = this.currentUrl() ?? '';
    return item.exact ? currentUrl === item.path : currentUrl.startsWith(item.path);
  }
}
