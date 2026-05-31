import { Routes } from '@angular/router';
import { IotDashboardComponent } from './pages/iot-dashboard/iot-dashboard.component';
import { AlertsViewComponent } from './views/alerts-view/alerts-view.component';

export const iotMonitoringRoutes: Routes = [
  { path: 'restaurant/dashboard', component: IotDashboardComponent },
  { path: 'restaurant/alerts', component: AlertsViewComponent },
];
