import { Routes } from '@angular/router';
import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { InventoryItemForm } from './components/inventory-item-form/inventory-item-form';

export const inventoryManagementRoutes: Routes = [
  { path: 'inventory/inventoryItems', component: InventoryPageComponent },
  { path: 'inventory/inventoryItems/new', component: InventoryItemForm },
  { path: 'inventory/inventoryItems/:id/edit', component: InventoryItemForm },
];
