import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/presentation/views/page-not-found.component';
import { PlaceholderPageComponent } from './shared/presentation/views/placeholder-page.component';
import { supplyAndPurchasingRoutes } from './supply-and-purchasing/presentation/supply-and-purchasing.routes';

const placeholderRoutes: Routes = [
  {
    path: 'dashboard',
    component: PlaceholderPageComponent,
    data: { title: 'Dashboard', description: 'This dashboard page is reserved for another bounded context.' }
  },
  {
    path: 'inventory',
    component: PlaceholderPageComponent,
    data: { title: 'Inventory', description: 'This inventory page is reserved for another bounded context.' }
  },
  {
    path: 'kitchen-tickets',
    component: PlaceholderPageComponent,
    data: { title: 'Kitchen Tickets', description: 'This kitchen tickets page is reserved for another bounded context.' }
  },
  {
    path: 'alerts',
    component: PlaceholderPageComponent,
    data: { title: 'Alerts', description: 'This alerts page is reserved for another bounded context.' }
  },
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
  },
  {
    path: 'tables-and-occupancy',
    component: PlaceholderPageComponent,
    data: { title: 'Tables and Occupancy', description: 'This occupancy page is reserved for another bounded context.' }
  }
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  ...placeholderRoutes,
  ...supplyAndPurchasingRoutes,
  { path: '**', component: PageNotFoundComponent, title: 'Page Not Found' }
];
