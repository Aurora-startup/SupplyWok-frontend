import { Routes } from '@angular/router';
import { AlertsViewComponent } from './views/alerts-view/alerts-view.component';
import { SupplierAlertsComponent } from './views/supplier-alerts/supplier-alerts.component';
import { SensorsViewComponent } from './views/sensors-view/sensors-view.component';

export const iotMonitoringRoutes: Routes = [
  { path: 'restaurant/alerts', component: AlertsViewComponent },
  { path: 'restaurant/sensors', component: SensorsViewComponent, title: 'Sensors' },
  { path: 'supplier/alerts', component: SupplierAlertsComponent, title: 'Supplier Alerts' },
  { path: 'supplier/alerts/:alertId/view', component: SupplierAlertsComponent, title: 'Supplier Alert Detail' },
];
