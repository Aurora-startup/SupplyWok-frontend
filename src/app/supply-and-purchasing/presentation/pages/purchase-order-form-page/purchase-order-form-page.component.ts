import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrderFormPanelComponent } from '../../components/purchase-order-form-panel/purchase-order-form-panel.component';

@Component({
  selector: 'app-purchase-order-form-page',
  imports: [TranslateModule, PurchaseOrderFormPanelComponent],
  template: `
    <section class="purchase-order-form-page">
      <div class="purchase-order-form-page__header">
        <span class="purchase-order-form-page__kicker">{{ 'supply-and-purchasing.purchase-order-form-page.kicker' | translate }}</span>
        <h1>{{ 'supply-and-purchasing.purchase-order-form-page.title' | translate }}</h1>
        <p>{{ 'supply-and-purchasing.purchase-order-form-page.description' | translate }}</p>
      </div>
      <app-purchase-order-form-panel></app-purchase-order-form-panel>
    </section>
  `,
  styles: [`
    .purchase-order-form-page {
      display: flex;
      flex-direction: column;
      gap: 18px;
      max-width: 720px;
    }

    .purchase-order-form-page__header h1 {
      margin: 0;
      color: #2f241d;
    }

    .purchase-order-form-page__header p {
      margin: 8px 0 0;
      color: #7f7064;
    }

    .purchase-order-form-page__kicker {
      color: #b56a16;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  `]
})
export class PurchaseOrderFormPageComponent {}
