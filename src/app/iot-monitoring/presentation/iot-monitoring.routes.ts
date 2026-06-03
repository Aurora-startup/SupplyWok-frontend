import { Routes } from '@angular/router';
import { AlertsViewComponent } from './views/alerts-view/alerts-view.component';

export const iotMonitoringRoutes: Routes = [
  { path: 'restaurant/alerts', component: AlertsViewComponent },
];
