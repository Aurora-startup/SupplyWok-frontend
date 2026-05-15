import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LowStockCard } from '../../components/low-stock-card/low-stock-card';
import { TempAlertCard } from '../../components/temp-alert-card/temp-alert-card';
import { ActiveTablesCard } from '../../components/active-tables-card/active-tables-card';
import { IotPanelCard } from '../../components/iot-panel-card/iot-panel-card';

@Component({
  selector: 'app-iot-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, LowStockCard, TempAlertCard, ActiveTablesCard, IotPanelCard],
  template: `
    <div class="page-container">
      <div style="display: flex; gap: 16px; padding: 16px;">
        <app-low-stock-card></app-low-stock-card>
        <app-temp-alert-card></app-temp-alert-card>
        <app-active-tables-card></app-active-tables-card>
      </div>
      <div style="padding: 0 16px 16px 16px;">
        <app-iot-panel-card></app-iot-panel-card>
      </div>
    </div>
  `
})
export class IotDashboardComponent {}
