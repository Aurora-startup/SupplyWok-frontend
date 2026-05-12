import { Routes } from '@angular/router';
import { TablesAndOccupancyComponent } from './pages/tables-and-occupancy/tables-and-occupancy.component';
import { KitchenTicketsComponent } from './pages/kitchen-tickets/kitchen-tickets.component';

export const restaurantManagementRoutes: Routes = [
  { path: 'tables-and-occupancy', component: TablesAndOccupancyComponent },
  { path: 'kitchen-tickets', component: KitchenTicketsComponent },
];
