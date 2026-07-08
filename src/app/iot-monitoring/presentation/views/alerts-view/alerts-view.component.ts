import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { IotStore } from '../../../application/iot-store';
import { RestaurantAlert, RestaurantAlertSeverity } from '../../../domain/model/restaurant-alert.entity';

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
    SelectModule,
    TagModule,
    DialogModule,
    TooltipModule
  ],
  templateUrl: './alerts-view.component.html',
  styleUrls: ['./alerts-view.component.css']
})
export class AlertsViewComponent implements OnInit {
  searchQuery = signal('');
  selectedSeverity = signal<RestaurantAlertSeverity | 'All'>('All');
  
  displayDialog = false;
  selectedAlert: RestaurantAlert | null = null;

  severities = [
    { labelKey: 'iot.alerts-page.severities.all', value: 'All' },
    { labelKey: 'iot.alerts-page.severities.critical', value: 'Critical' },
    { labelKey: 'iot.alerts-page.severities.high', value: 'High' },
    { labelKey: 'iot.alerts-page.severities.medium', value: 'Medium' },
    { labelKey: 'iot.alerts-page.severities.low', value: 'Low' }
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

  ngOnInit(): void {
    this.iotStore.loadRestaurantAlerts();
  }

  getSeveritySeverity(severity: RestaurantAlertSeverity): "danger" | "warn" | "info" | "secondary" {
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

  showDetails(alert: RestaurantAlert): void {
    this.selectedAlert = alert;
    this.displayDialog = true;
  }

  acknowledgeAlert(alert: RestaurantAlert): void {
    this.iotStore.acknowledgeRestaurantAlert(alert.id);
  }

  acknowledgeSelected(): void {
    if (this.selectedAlert) {
      this.iotStore.acknowledgeRestaurantAlert(this.selectedAlert.id);
      this.displayDialog = false;
    }
  }
}
