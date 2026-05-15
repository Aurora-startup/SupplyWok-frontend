import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrderStore } from '../../../application/purchase-order.store';

@Component({
  selector: 'app-suppliers-page',
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="suppliers-page">
      <header class="suppliers-page__hero">
        <span class="suppliers-page__kicker">{{ 'supply-and-purchasing.suppliers-page.kicker' | translate }}</span>
        <h1 class="suppliers-page__title">{{ 'supply-and-purchasing.suppliers-page.title' | translate }}</h1>
        <p class="suppliers-page__description">{{ 'supply-and-purchasing.suppliers-page.description' | translate }}</p>
      </header>

      <section class="suppliers-table-card">
        <div class="suppliers-table-card__table-wrap">
          @if (store.loading() && !store.suppliersLoaded()) {
            <div class="suppliers-table-card__state">
              {{ 'supply-and-purchasing.suppliers-page.loading' | translate }}
            </div>
          } @else if (store.errors().length && !supplierRows().length) {
            <div class="suppliers-table-card__state suppliers-table-card__state--error">
              {{ 'supply-and-purchasing.suppliers-page.error' | translate }}
            </div>
          } @else {
            <table class="suppliers-table">
              <thead>
                <tr>
                  <th>{{ 'supply-and-purchasing.suppliers-page.table.headers.supplier' | translate }}</th>
                  <th>{{ 'supply-and-purchasing.suppliers-page.table.headers.contact' | translate }}</th>
                  <th>{{ 'supply-and-purchasing.suppliers-page.table.headers.categories' | translate }}</th>
                  <th>{{ 'supply-and-purchasing.suppliers-page.table.headers.history' | translate }}</th>
                  <th>{{ 'supply-and-purchasing.suppliers-page.table.headers.responseTime' | translate }}</th>
                </tr>
              </thead>

              <tbody>
                @for (row of visibleSupplierRows(); track row.id) {
                  <tr>
                    <td class="suppliers-table__supplier-cell">{{ row.supplier }}</td>
                    <td>
                      <div class="suppliers-table__contact">
                        <strong>{{ row.contact }}</strong>
                        <small>{{ row.email }}</small>
                        <small>{{ row.phone }}</small>
                      </div>
                    </td>
                    <td>
                      <span class="suppliers-table__tag">{{ getCategoryLabelKey(row.category) | translate }}</span>
                    </td>
                    <td>
                      <div class="suppliers-table__history">
                        <strong>{{ row.linkedDate }}</strong>
                        <small>{{ row.sla }}</small>
                      </div>
                    </td>
                    <td class="suppliers-table__time">{{ row.responseTime }}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>

        <footer class="suppliers-table-card__footer">
          <p>
            {{ 'supply-and-purchasing.suppliers-page.footer.showing' | translate:{
              from: paginationSummary().from,
              to: paginationSummary().to,
              total: paginationSummary().total
            } }}
          </p>
          <div class="suppliers-table-card__pagination">
            <button type="button" [disabled]="!canGoPrevious()" (click)="goToPreviousPage()">
              {{ 'supply-and-purchasing.suppliers-page.footer.previous' | translate }}
            </button>
            <button type="button" class="suppliers-table-card__pagination-next" [disabled]="!canGoNext()" (click)="goToNextPage()">
              {{ 'supply-and-purchasing.suppliers-page.footer.next' | translate }}
            </button>
          </div>
        </footer>
      </section>
    </section>
  `,
  styles: [`
    .suppliers-page {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .suppliers-page__hero {
      padding: 12px 6px 0;
    }

    .suppliers-page__kicker {
      display: inline-block;
      color: #a07832;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .suppliers-page__title {
      margin: 10px 0 8px;
      color: #221b2a;
      font-size: clamp(2.6rem, 4vw, 3.3rem);
      line-height: 1;
      letter-spacing: -0.04em;
    }

    .suppliers-page__description {
      margin: 0;
      color: #5b5247;
      font-size: 1.03rem;
    }

    .suppliers-table-card {
      background: #ffffff;
      border: 1px solid #eadbca;
      border-radius: 22px;
      box-shadow: 0 18px 36px rgba(47, 36, 29, 0.1);
      overflow: hidden;
    }

    .suppliers-table-card__state {
      padding: 24px 20px;
      color: #7e756b;
    }

    .suppliers-table-card__state--error {
      color: #b42318;
    }

    .suppliers-table {
      width: 100%;
      border-collapse: collapse;
    }

    .suppliers-table thead th {
      padding: 15px 20px;
      border-bottom: 1px solid #eadbca;
      color: #85796d;
      font-size: 0.94rem;
      font-weight: 700;
      text-align: left;
    }

    .suppliers-table tbody td {
      padding: 14px 20px;
      border-bottom: 1px solid #f0e7dc;
      color: #31272f;
      vertical-align: middle;
    }

    .suppliers-table__supplier-cell {
      font-size: 1.02rem;
      font-weight: 700;
    }

    .suppliers-table__contact,
    .suppliers-table__history {
      display: grid;
      gap: 2px;
    }

    .suppliers-table__contact strong,
    .suppliers-table__history strong {
      color: #31272f;
    }

    .suppliers-table__contact small,
    .suppliers-table__history small {
      color: #7e756b;
      font-size: 0.92rem;
    }

    .suppliers-table__tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 28px;
      padding: 0 12px;
      border-radius: 999px;
      background: #f2efeb;
      color: #676057;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .suppliers-table__time {
      color: #5a5249;
      font-weight: 600;
    }

    .suppliers-table-card__footer {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      padding: 14px 20px;
    }

    .suppliers-table-card__footer p {
      margin: 0;
      color: #8b8175;
      font-size: 0.95rem;
    }

    .suppliers-table-card__pagination {
      display: flex;
      gap: 8px;
    }

    .suppliers-table-card__pagination button {
      min-height: 36px;
      padding: 0 14px;
      border: 1px solid #e6dbcf;
      border-radius: 12px;
      background: #ffffff;
      color: #6d6258;
      font-weight: 600;
      cursor: pointer;
    }

    .suppliers-table-card__pagination button:disabled {
      color: #b8ada3;
      cursor: not-allowed;
    }

    .suppliers-table-card__pagination-next {
      background: #2d241e !important;
      color: #ffffff !important;
      border-color: #2d241e !important;
    }

    @media (max-width: 1100px) {
      .suppliers-table-card__table-wrap {
        overflow-x: auto;
      }

      .suppliers-table {
        min-width: 930px;
      }
    }

    @media (max-width: 700px) {
      .suppliers-table-card__footer {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class SuppliersPageComponent implements OnInit {
  protected readonly store = inject(PurchaseOrderStore);
  private readonly itemsPerPage = 5;
  protected readonly currentPage = signal(1);

  protected readonly supplierRows = computed(() =>
    this.store.supplierDirectory().map((supplier) => ({
      id: supplier.id,
      supplier: supplier.name,
      contact: supplier.contactName || 'No contact',
      email: supplier.email || 'No email',
      phone: supplier.phone || 'No phone',
      category: this.normalizeCategory(supplier.category),
      linkedDate: supplier.linkedDate || '--',
      sla: supplier.sla || '--',
      responseTime: supplier.responseTime || '--'
    }))
  );

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.supplierRows().length / this.itemsPerPage))
  );

  protected readonly visibleSupplierRows = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.supplierRows().slice(start, start + this.itemsPerPage);
  });

  protected readonly paginationSummary = computed(() => {
    if (!this.supplierRows().length) {
      return { from: 0, to: 0, total: 0 };
    }

    const from = (this.currentPage() - 1) * this.itemsPerPage + 1;
    const to = Math.min(this.currentPage() * this.itemsPerPage, this.supplierRows().length);
    return { from, to, total: this.supplierRows().length };
  });

  protected readonly canGoPrevious = computed(() => this.currentPage() > 1);
  protected readonly canGoNext = computed(() => this.currentPage() < this.totalPages());

  ngOnInit(): void {
    this.store.ensureSuppliersLoaded();
  }

  protected goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.currentPage.update((page) => page - 1);
    }
  }

  protected goToNextPage(): void {
    if (this.canGoNext()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  protected getCategoryLabelKey(category: string): string {
    return `supply-and-purchasing.suppliers-page.table.categories.${category.toLowerCase()}`;
  }

  private normalizeCategory(category: string): string {
    const normalized = String(category ?? '').trim().toUpperCase();
    if (!normalized) return 'SAUCES';
    if (normalized.includes('GRAIN') || normalized.includes('PANTRY')) return 'GRAINS';
    if (normalized.includes('PROTEIN') || normalized.includes('COLD')) return 'PROTEIN';
    if (normalized.includes('SAUCE') || normalized.includes('OIL') || normalized.includes('ASIAN')) return 'SAUCES';
    if (normalized.includes('SEAFOOD')) return 'SEAFOOD';
    return normalized;
  }
}
