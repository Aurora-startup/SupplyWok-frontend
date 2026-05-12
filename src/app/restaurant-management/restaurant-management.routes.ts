import { Routes } from '@angular/router';
import { TablesAndOccupancyComponent } from './presentation/pages/tables-and-occupancy/tables-and-occupancy.component';
import { KitchenTicketsComponent } from './presentation/pages/kitchen-tickets/kitchen-tickets.component';

export const restaurantManagementRoutes: Routes = [
  { path: 'tables-and-occupancy', component: TablesAndOccupancyComponent },
  { path: 'kitchen-tickets', component: KitchenTicketsComponent },
];
