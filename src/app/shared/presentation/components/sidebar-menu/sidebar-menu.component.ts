import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface MenuItem {
  id: string;
  i18nKey: string;
  iconOff: string;
  iconOn: string;
}

/**
 * @component SidebarMenuComponent
 * @summary Main navigation sidebar for the Angular application, displaying the branding and main modules.
 * @author Aurora Development Team
 */
@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.css'
})
export class SidebarMenuComponent {
  /** Reactive state for the currently active menu item ID. */
  activeItem = signal<string>('dashboard');

  /** Reactive state for the restaurant name. */
  restaurantName = signal<string>('GRAN DRAGÓN CHIFA');

  /** Reactive state for the current subscription plan. */
  currentPlan = signal<string>('Premium');

  /** Array containing the main navigation items. */
  menuItems: MenuItem[] = [
    { id: 'dashboard', i18nKey: 'shared.sidebar.dashboard', iconOff: '/assets/images/icons/dashboard-icon.svg', iconOn: '/assets/images/icons/dashboard-on-icon.svg' },
    { id: 'inventory', i18nKey: 'shared.sidebar.inventory', iconOff: '/assets/images/icons/inventory-icon.svg', iconOn: '/assets/images/icons/inventory-on-icon.svg' },
    { id: 'orders', i18nKey: 'shared.sidebar.orders', iconOff: '/assets/images/icons/orders-icon.svg', iconOn: '/assets/images/icons/orders-on-icon.svg' },
    { id: 'kitchen-tickets', i18nKey: 'shared.sidebar.kitchen-tickets', iconOff: '/assets/images/icons/kitchen-ticket-icon.svg', iconOn: '/assets/images/icons/kitchen-tickets-on-icon.svg' },
    { id: 'suppliers', i18nKey: 'shared.sidebar.suppliers', iconOff: '/assets/images/icons/suppliers-icon.svg', iconOn: '/assets/images/icons/suppliers-on-icon.svg' },
    { id: 'tables-and-occupancy', i18nKey: 'shared.sidebar.tables-and-occupancy', iconOff: '/assets/images/icons/tables-and-occupancy-icon.svg', iconOn: '/assets/images/icons/tables-and-occupancy-on-icon.svg' },
    { id: 'alerts', i18nKey: 'shared.sidebar.alerts', iconOff: '/assets/images/icons/alerts-icon.svg', iconOn: '/assets/images/icons/alerts-on-icon.svg' },
    { id: 'reports', i18nKey: 'shared.sidebar.reports', iconOff: '/assets/images/icons/reports-icon.svg', iconOn: '/assets/images/icons/reports-on-icon.svg' },
    { id: 'configuration', i18nKey: 'shared.sidebar.configuration', iconOff: '/assets/images/icons/configuration-icon.svg', iconOn: '/assets/images/icons/configuration-on-icon.svg' },
    { id: 'subscription', i18nKey: 'shared.sidebar.subscription', iconOff: '/assets/images/icons/subscripcion-icon.svg', iconOn: '/assets/images/icons/subscription-on-icon.svg' }
  ];

  /**
   * Sets the given item ID as the active selection in the menu.
   * @param itemId The ID of the menu item to activate.
   */
  selectItem(itemId: string): void {
    this.activeItem.set(itemId);
  }
}
