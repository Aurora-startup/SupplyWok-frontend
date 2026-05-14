import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { IotStore } from '../../../application/iot-store';
import { Alert, AlertSeverity } from '../../../domain/model/alert.entity';

@Component({
  selector: 'app-alerts-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    TagModule,
    DialogModule
  ],
  templateUrl: './alerts-view.component.html',
  styleUrls: ['./alerts-view.component.css']
})
export class AlertsViewComponent {
  searchQuery = signal('');
  selectedSeverity = signal<AlertSeverity | 'All'>('All');
  
  displayDialog = false;
  selectedAlert: Alert | null = null;

  severities = [
    { label: 'All', value: 'All' },
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  filteredAlerts = computed(() => {
    let alerts = this.iotStore.allAlerts();
    
    const query = this.searchQuery().toLowerCase();
    if (query) {
      alerts = alerts.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.message.toLowerCase().includes(query) ||
        a.source.toLowerCase().includes(query)
      );
    }

    const severity = this.selectedSeverity();
    if (severity !== 'All') {
      alerts = alerts.filter(a => a.severity === severity);
    }

    return alerts;
  });

  constructor(public iotStore: IotStore) {}

  getSeveritySeverity(severity: AlertSeverity): "danger" | "warn" | "info" | "secondary" {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'High': return 'warn';
      case 'Medium': return 'info';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  }

  getStatusSeverity(status: string): "success" | "info" | "warn" {
    switch (status) {
      case 'Open': return 'warn';
      case 'Acknowledged': return 'info';
      case 'Resolved': return 'success';
      default: return 'info';
    }
  }

  showDetails(alert: Alert): void {
    this.selectedAlert = alert;
    this.displayDialog = true;
  }

  acknowledgeAlert(alert: Alert): void {
    this.iotStore.acknowledgeAlert(alert.id);
  }

  acknowledgeSelected(): void {
    if (this.selectedAlert) {
      this.iotStore.acknowledgeAlert(this.selectedAlert.id);
      this.displayDialog = false;
    }
  }
}
