import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/presentation/views/page-not-found.component';
import { PlaceholderPageComponent } from './shared/presentation/views/placeholder-page.component';
import { supplyAndPurchasingRoutes } from './supply-and-purchasing/presentation/supply-and-purchasing.routes';
import { restaurantManagementRoutes } from './restaurant-management/presentation/restaurant-management.routes';
import { iotMonitoringRoutes } from './iot-monitoring/presentation/iot-monitoring.routes';
import { inventoryManagementRoutes } from './inventory-management/presentation/inventory-management.routes';
import { LoginComponent } from './iam/presentation/views/login/login.component';
import { RegisterComponent } from './iam/presentation/views/register/register.component';
import { supplierManagementRoutes } from './supplier-management/presentation/supplier-management.routes';
import { authGuard } from './iam/presentation/guards/auth.guard';
import { guestGuard } from './iam/presentation/guards/guest.guard';

const placeholderRoutes: Routes = [
  {
    path: 'restaurant/reports',
    component: PlaceholderPageComponent,
    data: { title: 'Reports', description: 'This reports page is reserved for another bounded context.' }
  },
  {
    path: 'restaurant/configuration',
    component: PlaceholderPageComponent,
    data: { title: 'Configuration', description: 'This configuration page is reserved for another bounded context.' }
  },
  {
    path: 'restaurant/subscription',
    component: PlaceholderPageComponent,
    data: { title: 'Subscription', description: 'This subscription page is reserved for another bounded context.' }
  }
];

const legacyRedirectRoutes: Routes = [
  { path: 'restaurant', pathMatch: 'full', redirectTo: 'restaurant/dashboard' },
  { path: 'dashboard', pathMatch: 'full', redirectTo: 'restaurant/dashboard' },
  { path: 'alerts', pathMatch: 'full', redirectTo: 'restaurant/alerts' },
  { path: 'reports', pathMatch: 'full', redirectTo: 'restaurant/reports' },
  { path: 'configuration', pathMatch: 'full', redirectTo: 'restaurant/configuration' },
  { path: 'subscription', pathMatch: 'full', redirectTo: 'restaurant/subscription' },
  { path: 'inventory', pathMatch: 'full', redirectTo: 'restaurant/inventory' },
  { path: 'inventory/inventoryItems', pathMatch: 'full', redirectTo: 'restaurant/inventory' },
  { path: 'inventory/inventoryItems/new', pathMatch: 'full', redirectTo: 'restaurant/inventory/new' },
  { path: 'inventory/inventoryItems/:id/edit', redirectTo: 'restaurant/inventory/:id/edit' },
  { path: 'orders', pathMatch: 'full', redirectTo: 'restaurant/orders' },
  { path: 'orders/new', pathMatch: 'full', redirectTo: 'restaurant/orders/new' },
  { path: 'suppliers', pathMatch: 'full', redirectTo: 'restaurant/suppliers' },
  { path: 'kitchen-tickets', pathMatch: 'full', redirectTo: 'restaurant/kitchen' },
  { path: 'tables-and-occupancy', pathMatch: 'full', redirectTo: 'restaurant/tables' }
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  ...legacyRedirectRoutes,
  {
    path: '',
    canActivate: [authGuard],
    children: [
      ...supplierManagementRoutes,
      ...placeholderRoutes,
      ...supplyAndPurchasingRoutes,
      ...restaurantManagementRoutes,
      ...iotMonitoringRoutes,
      ...inventoryManagementRoutes
    ]
  },
  { path: '**', component: PageNotFoundComponent, title: 'Page Not Found' }
];
