import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-suppliers-page',
  imports: [TranslateModule],
  template: `
    <section class="suppliers-page">
      <span class="suppliers-page__kicker">{{ 'supply-and-purchasing.suppliers-page.kicker' | translate }}</span>
      <h1>{{ 'supply-and-purchasing.suppliers-page.title' | translate }}</h1>
      <p>{{ 'supply-and-purchasing.suppliers-page.description' | translate }}</p>
    </section>
  `,
  styles: [`
    .suppliers-page {
      display: grid;
      gap: 8px;
      padding: 24px;
      border-radius: 18px;
      background: #fffdf9;
      box-shadow: 0 14px 34px rgba(45, 36, 30, 0.08);
    }

    .suppliers-page__kicker {
      color: #a07832;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: #342923;
    }

    p {
      margin: 0;
      color: #65594f;
    }
  `]
})
export class SuppliersPageComponent {}
