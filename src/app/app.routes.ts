import { Routes } from '@angular/router';
import { restaurantManagementRoutes } from './restaurant-management/restaurant-management.routes';

export const routes: Routes = [
  ...restaurantManagementRoutes,
  { path: '', redirectTo: 'tables-and-occupancy', pathMatch: 'full' },
];
