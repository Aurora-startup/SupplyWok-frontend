import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrderStore } from '../../../application/purchase-order.store';
import { PurchaseOrderFormPanelComponent } from '../../components/purchase-order-form-panel/purchase-order-form-panel.component';
import { PurchaseOrdersTableComponent } from '../../components/purchase-orders-table/purchase-orders-table.component';

@Component({
  selector: 'app-orders-page',
  imports: [TranslateModule, PurchaseOrderFormPanelComponent, PurchaseOrdersTableComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css'
})
export class OrdersPageComponent implements OnInit {
  protected readonly store = inject(PurchaseOrderStore);

  ngOnInit(): void {
    this.store.ensurePurchaseOrdersLoaded();
  }
}
