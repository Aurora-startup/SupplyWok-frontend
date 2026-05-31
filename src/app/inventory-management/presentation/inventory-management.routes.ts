import { Routes } from '@angular/router';
import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { InventoryItemForm } from './components/inventory-item-form/inventory-item-form';

export const inventoryManagementRoutes: Routes = [
  { path: 'restaurant/inventory', component: InventoryPageComponent },
  { path: 'restaurant/inventory/new', component: InventoryItemForm },
  { path: 'restaurant/inventory/:id/edit', component: InventoryItemForm },
];
