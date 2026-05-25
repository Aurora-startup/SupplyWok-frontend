import { Routes } from '@angular/router';
import { Alerts } from './views/alerts/alerts';
import { Catalog } from './views/catalog/catalog';
import { Clients } from './views/clients/clients';
import { Dashboard } from './views/dashboard/dashboard';
import { Delivery } from './views/delivery/delivery';
import { Forecast } from './views/forecast/forecast';
import { Orders } from './views/orders/orders';
import { Settings } from './views/settings/settings';
import { Subscription } from './views/subscription/subscription';

export const supplierManagementRoutes: Routes = [
  { path: 'supplier', pathMatch: 'full', redirectTo: 'supplier/dashboard' },
  { path: 'supplier/dashboard', component: Dashboard, title: 'Supplier Dashboard' },
  { path: 'supplier/orders', component: Orders, title: 'Supplier Orders' },
  { path: 'supplier/orders/:orderId/view', component: Orders, title: 'Supplier Order Detail' },
  { path: 'supplier/clients', component: Clients, title: 'Supplier Clients' },
  { path: 'supplier/delivery', component: Delivery, title: 'Supplier Delivery' },
  { path: 'supplier/forecast', component: Forecast, title: 'Supplier Forecast' },
  { path: 'supplier/catalog', component: Catalog, title: 'Supplier Catalog' },
  { path: 'supplier/catalog/new', component: Catalog, title: 'New Catalog Item' },
  { path: 'supplier/catalog/:itemId/edit', component: Catalog, title: 'Edit Catalog Item' },
  { path: 'supplier/alerts', component: Alerts, title: 'Supplier Alerts' },
  { path: 'supplier/alerts/:alertId/view', component: Alerts, title: 'Supplier Alert Detail' },
  { path: 'supplier/configuration', component: Settings, title: 'Supplier Configuration' },
  { path: 'supplier/subscription', component: Subscription, title: 'Supplier Subscription' }
];
