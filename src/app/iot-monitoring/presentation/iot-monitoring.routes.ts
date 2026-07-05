import { Routes } from '@angular/router';
import { AlertsViewComponent } from './views/alerts-view/alerts-view.component';
import { SupplierAlertsComponent } from './views/supplier-alerts/supplier-alerts.component';

export const iotMonitoringRoutes: Routes = [
  { path: 'restaurant/alerts', component: AlertsViewComponent },
  { path: 'supplier/alerts', component: SupplierAlertsComponent, title: 'Supplier Alerts' },
  { path: 'supplier/alerts/:alertId/view', component: SupplierAlertsComponent, title: 'Supplier Alert Detail' },
];
