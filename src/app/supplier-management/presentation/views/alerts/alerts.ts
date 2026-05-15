import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { map } from 'rxjs/operators';
import { SupplierManagementStore } from '../../../application/supplier-management-store';
import { SupplierAlert } from '../../../domain/model/supplier-alert.entity';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule, FormsModule, TranslateModule, TableModule, ButtonModule, InputTextModule, SelectModule, TagModule, DialogModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts implements OnInit {
  readonly store = inject(SupplierManagementStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly alertId = toSignal(this.route.paramMap.pipe(map((params) => params.get('alertId'))), { initialValue: null });

  searchQuery = '';
  severityFilter = 'all';

  readonly severityOptions = computed(() => [
    { label: this.translate.instant('supplier-management.orders.filters.all'), value: 'all' },
    { label: this.translate.instant('supplier-management.alerts.severity.high'), value: 'high' },
    { label: this.translate.instant('supplier-management.alerts.severity.medium'), value: 'medium' },
    { label: this.translate.instant('supplier-management.alerts.severity.low'), value: 'low' }
  ]);
  readonly selectedAlert = computed(() => this.store.getAlertById(this.alertId()));

  get filteredAlerts(): SupplierAlert[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.store.alerts().filter((alert) => {
      const matchesSeverity = this.severityFilter === 'all' || alert.severity === this.severityFilter;
      const matchesQuery = !query || [alert.detail, alert.severity, alert.status, alert.date]
        .some((value) => String(value ?? '').toLowerCase().includes(query));
      return matchesSeverity && matchesQuery;
    });
  }

  ngOnInit(): void {
    this.store.loadAlerts();
  }

  openDetails(alert: SupplierAlert): void {
    void this.router.navigate(['/supplier/alerts', alert.id, 'view']);
  }

  closeDetails(): void {
    void this.router.navigate(['/supplier/alerts']);
  }

  acknowledge(alert: SupplierAlert): void {
    this.store.acknowledgeAlert(alert);
  }

  getSeverity(severity: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (severity === 'high') return 'danger';
    if (severity === 'medium') return 'warn';
    if (severity === 'low') return 'info';
    return 'secondary';
  }

  formatAlertDate(value: string): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}
