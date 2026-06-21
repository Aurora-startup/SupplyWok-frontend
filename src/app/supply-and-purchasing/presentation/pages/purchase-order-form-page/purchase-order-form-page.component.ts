import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrderFormPanelComponent } from '../../components/purchase-order-form-panel/purchase-order-form-panel.component';

@Component({
  selector: 'app-purchase-order-form-page',
  imports: [TranslateModule, PurchaseOrderFormPanelComponent],
  templateUrl: './purchase-order-form-page.component.html',
  styleUrl: './purchase-order-form-page.component.css'
})
export class PurchaseOrderFormPageComponent {}
