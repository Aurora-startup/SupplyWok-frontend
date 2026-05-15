import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/presentation/views/page-not-found.component';
import { PlaceholderPageComponent } from './shared/presentation/views/placeholder-page.component';
import { supplyAndPurchasingRoutes } from './supply-and-purchasing/presentation/supply-and-purchasing.routes';
import { restaurantManagementRoutes } from './restaurant-management/presentation/restaurant-management.routes';
import { iotMonitoringRoutes } from './iot-monitoring/presentation/iot-monitoring.routes';
import { inventoryManagementRoutes } from './inventory-management/presentation/inventory-management.routes';
import { LoginComponent } from './iam/presentation/views/login/login.component';
import { RegisterComponent } from './iam/presentation/views/register/register.component';

const placeholderRoutes: Routes = [
  {
    path: 'reports',
    component: PlaceholderPageComponent,
    data: { title: 'Reports', description: 'This reports page is reserved for another bounded context.' }
  },
  {
    path: 'configuration',
    component: PlaceholderPageComponent,
    data: { title: 'Configuration', description: 'This configuration page is reserved for another bounded context.' }
  },
  {
    path: 'subscription',
    component: PlaceholderPageComponent,
    data: { title: 'Subscription', description: 'This subscription page is reserved for another bounded context.' }
  }
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  ...placeholderRoutes,
  ...supplyAndPurchasingRoutes,
  ...restaurantManagementRoutes,
  ...iotMonitoringRoutes,
  ...inventoryManagementRoutes,
  { path: '**', component: PageNotFoundComponent, title: 'Page Not Found' }
];
