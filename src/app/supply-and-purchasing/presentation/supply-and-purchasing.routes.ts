import { Routes } from '@angular/router';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { PurchaseOrderFormPageComponent } from './pages/purchase-order-form-page/purchase-order-form-page.component';
import { SuppliersPageComponent } from './pages/suppliers-page/suppliers-page.component';

export const supplyAndPurchasingRoutes: Routes = [
  {
    path: 'orders',
    component: OrdersPageComponent,
    title: 'Orders'
  },
  {
    path: 'orders/new',
    component: PurchaseOrderFormPageComponent,
    title: 'Create Order'
  },
  {
    path: 'suppliers',
    component: SuppliersPageComponent,
    title: 'Suppliers'
  }
];
