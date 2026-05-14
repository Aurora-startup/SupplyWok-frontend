import { Routes } from '@angular/router';
import { LoginComponent } from './iam/presentation/views/login/login.component';
import { RegisterComponent } from './iam/presentation/views/register/register.component';
import { LayoutComponent } from './shared/presentation/components/layout/layout.component';
import { DashboardComponent } from './iot-monitoring/presentation/views/dashboard/dashboard.component';
import { AlertsViewComponent } from './iot-monitoring/presentation/views/alerts-view/alerts-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'restaurant',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'alerts', component: AlertsViewComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
