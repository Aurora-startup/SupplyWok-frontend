import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reports-page',
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="reports-page">
      <header class="reports-page__hero">
        <div>
          <span class="reports-page__kicker">{{ 'restaurantManagement.reportsPage.kicker' | translate }}</span>
          <h1 class="reports-page__title">{{ 'restaurantManagement.reportsPage.title' | translate }}</h1>
          <p class="reports-page__description">{{ 'restaurantManagement.reportsPage.description' | translate }}</p>
        </div>

        <div class="reports-page__actions">
          <button type="button" class="reports-page__secondary-action" (click)="exportCsv()">
            <i class="pi pi-download"></i>
            <span>{{ 'restaurantManagement.reportsPage.actions.exportCsv' | translate }}</span>
          </button>
          <button type="button" class="reports-page__primary-action" (click)="exportPdf()">
            <i class="pi pi-file-pdf"></i>
            <span>{{ 'restaurantManagement.reportsPage.actions.exportPdf' | translate }}</span>
          </button>
        </div>
      </header>

      <article class="reports-page__chart-card reports-page__chart-card--wide">
        <div class="reports-page__card-header">
          <h2>{{ 'restaurantManagement.reportsPage.charts.inventoryTitle' | translate }}</h2>
          <i class="pi pi-ellipsis-v"></i>
        </div>

        <svg viewBox="0 0 820 210" class="reports-page__line-chart" aria-hidden="true">
          <defs>
            <linearGradient id="inventory-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#ef3b34" stop-opacity="0.24" />
              <stop offset="100%" stop-color="#ef3b34" stop-opacity="0.02" />
            </linearGradient>
          </defs>

          <path d="M20 148 C100 126, 180 126, 260 148 S420 194, 500 168 S620 86, 700 70 S770 62, 800 56 L800 190 L20 190 Z" fill="url(#inventory-fill)" />
          <path d="M20 148 C100 126, 180 126, 260 148 S420 194, 500 168 S620 86, 700 70 S770 62, 800 56" fill="none" stroke="#ef3b34" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="20" y1="190" x2="800" y2="190" stroke="#ebe2d7" stroke-width="2" />
        </svg>

        <div class="reports-page__axis-labels">
          @for (label of monthLabels; track label) {
            <span>{{ label }}</span>
          }
        </div>
      </article>

      <div class="reports-page__grid">
        <article class="reports-page__chart-card">
          <div class="reports-page__card-header">
            <h2>{{ 'restaurantManagement.reportsPage.charts.consumptionTitle' | translate }}</h2>
            <i class="pi pi-ellipsis-v"></i>
          </div>

          <svg viewBox="0 0 240 150" class="reports-page__mini-chart" aria-hidden="true">
            <line x1="20" y1="118" x2="220" y2="118" stroke="#ebe2d7" stroke-width="2" />
            <rect x="20" y="56" width="36" height="62" fill="#f7bf00" />
            <rect x="56" y="30" width="36" height="88" fill="#f7bf00" />
            <rect x="92" y="70" width="36" height="48" fill="#f7bf00" />
            <rect x="128" y="8" width="36" height="110" fill="#f7bf00" />
            <rect x="164" y="42" width="36" height="76" fill="#f7bf00" />
            <rect x="200" y="0" width="36" height="118" fill="#f7bf00" />
          </svg>

          <div class="reports-page__mini-axis">
            @for (label of weekLabels; track label) {
              <span>{{ label }}</span>
            }
          </div>

          <div class="reports-page__summary">
            <strong>{{ 'restaurantManagement.reportsPage.charts.summary' | translate }}</strong>
            <p>{{ 'restaurantManagement.reportsPage.charts.summaryDesc' | translate:{ from: 40, to: 52 } }}</p>
          </div>
        </article>

        <article class="reports-page__chart-card">
          <div class="reports-page__card-header">
            <h2>{{ 'restaurantManagement.reportsPage.charts.ordersTitle' | translate }}</h2>
            <i class="pi pi-ellipsis-v"></i>
          </div>

          <div class="reports-page__horizontal-bars">
            @for (row of supplierRows; track row.name) {
              <div class="reports-page__horizontal-row">
                <span>{{ row.name }}</span>
                <div><strong [style.width.%]="row.value"></strong></div>
                <small>{{ row.value }}</small>
              </div>
            }
          </div>

          <div class="reports-page__summary">
            <strong>{{ 'restaurantManagement.reportsPage.charts.summary' | translate }}</strong>
            <p>{{ 'restaurantManagement.reportsPage.charts.summaryValue' | translate:{ value: 8 } }}</p>
          </div>
        </article>

        <article class="reports-page__chart-card">
          <div class="reports-page__card-header">
            <h2>{{ 'restaurantManagement.reportsPage.charts.tempTitle' | translate }}</h2>
            <i class="pi pi-ellipsis-v"></i>
          </div>

          <svg viewBox="0 0 240 150" class="reports-page__mini-chart" aria-hidden="true">
            <line x1="20" y1="118" x2="220" y2="118" stroke="#ebe2d7" stroke-width="2" />
            <line x1="20" y1="88" x2="220" y2="88" stroke="#f5ede4" stroke-width="1" />
            <line x1="20" y1="58" x2="220" y2="58" stroke="#f5ede4" stroke-width="1" />
            <rect x="24" y="72" width="28" height="22" fill="#ef7f84" />
            <rect x="52" y="84" width="28" height="10" fill="#ef7f84" />
            <rect x="80" y="48" width="28" height="46" fill="#ef7f84" />
            <rect x="108" y="66" width="28" height="28" fill="#ef7f84" />
            <rect x="136" y="28" width="28" height="66" fill="#ef7f84" />
            <rect x="164" y="76" width="28" height="18" fill="#ef7f84" />
            <rect x="192" y="84" width="28" height="10" fill="#ef7f84" />
          </svg>

          <div class="reports-page__mini-axis reports-page__mini-axis--seven">
            @for (label of weekdayLabels; track label) {
              <span>{{ label }}</span>
            }
          </div>

          <div class="reports-page__summary">
            <strong>{{ 'restaurantManagement.reportsPage.charts.summary' | translate }}</strong>
            <p>{{ 'restaurantManagement.reportsPage.charts.summaryValue' | translate:{ value: 9 } }}</p>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .reports-page { display: flex; flex-direction: column; gap: 18px; }
    .reports-page__hero { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; padding: 6px 0 0; }
    .reports-page__kicker { display: inline-block; color: #a07832; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .reports-page__title { margin: 10px 0 8px; color: #221b2a; font-size: clamp(2.6rem, 4vw, 3.3rem); line-height: 1; letter-spacing: -0.04em; }
    .reports-page__description { color: #5b5247; font-size: 1.03rem; }
    .reports-page__actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .reports-page__actions button { display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 16px; border-radius: 14px; font-weight: 600; cursor: pointer; }
    .reports-page__secondary-action { border: 1px solid #3a312b; background: #ffffff; color: #3a312b; }
    .reports-page__primary-action { border: none; background: #2d241e; color: #ffffff; }
    .reports-page__chart-card { background: #ffffff; border: 1px solid #e3d4c5; border-radius: 18px; box-shadow: 0 16px 34px rgba(47, 36, 29, 0.1); padding: 18px 20px; }
    .reports-page__chart-card--wide { padding-bottom: 14px; }
    .reports-page__card-header { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
    .reports-page__card-header h2 { margin: 0; color: #2c2328; font-size: 1.05rem; font-weight: 700; }
    .reports-page__card-header i { color: #594f46; }
    .reports-page__line-chart { width: 100%; height: 220px; margin-top: 6px; }
    .reports-page__axis-labels, .reports-page__mini-axis { display: grid; color: #5a5147; font-size: 0.88rem; }
    .reports-page__axis-labels { grid-template-columns: repeat(6, 1fr); padding: 0 14px 0 18px; }
    .reports-page__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
    .reports-page__mini-chart { width: 100%; height: 170px; margin-top: 10px; }
    .reports-page__mini-axis { grid-template-columns: repeat(6, 1fr); padding: 0 10px; }
    .reports-page__mini-axis--seven { grid-template-columns: repeat(7, 1fr); }
    .reports-page__horizontal-bars { display: grid; gap: 12px; margin-top: 26px; }
    .reports-page__horizontal-row { display: grid; grid-template-columns: 1fr 124px auto; gap: 8px; align-items: center; color: #5a5147; font-size: 0.9rem; }
    .reports-page__horizontal-row div { height: 18px; border-radius: 4px; background: #ece6df; overflow: hidden; }
    .reports-page__horizontal-row strong { display: block; height: 100%; background: linear-gradient(90deg, #ba7a3c 0%, #a2592b 100%); }
    .reports-page__summary { margin-top: 16px; border-top: 1px solid #ece4db; padding-top: 12px; color: #574d43; }
    .reports-page__summary strong { display: block; margin-bottom: 6px; }
    @media (max-width: 1120px) { .reports-page__grid { grid-template-columns: 1fr; } }
    @media (max-width: 900px) { .reports-page__hero { flex-direction: column; } }
  `]
})
export class ReportsPageComponent {
  protected readonly monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  protected readonly weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
  protected readonly weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  protected readonly supplierRows = [
    { name: 'Golden Wok', value: 85 },
    { name: 'Andes', value: 60 },
    { name: 'Orient', value: 45 },
    { name: 'Pacific', value: 30 }
  ];

  constructor(private readonly translate: TranslateService) {}

  protected exportCsv(): void {
    const rows = [
      [
        this.translate.instant('restaurantManagement.reportsPage.charts.month'),
        this.translate.instant('restaurantManagement.reportsPage.charts.inventoryTitle')
      ],
      ['Jan', 42],
      ['Feb', 46],
      ['Mar', 34],
      ['Apr', 31],
      ['May', 58],
      ['Jun', 64]
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = 'supplywok-reports.csv';
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }

  protected exportPdf(): void {
    window.print();
  }
}
