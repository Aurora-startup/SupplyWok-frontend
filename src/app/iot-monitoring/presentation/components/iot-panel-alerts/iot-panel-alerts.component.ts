import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { AlertItemComponent } from '../alert-item/alert-item.component';
import { IotStore } from '../../../application/iot-store';

/**
 * Renders the 3 most recent alerts inside the main IoT panel.
 */
@Component({
  selector: 'app-iot-panel-alerts',
  imports: [NgFor, AlertItemComponent],
  template: `
    <div class="panel-alerts-container">
      <app-alert-item 
        *ngFor="let alert of store.recentAlerts()" 
        [alert]="alert">
      </app-alert-item>
    </div>
  `,
  styles: [`
    .panel-alerts-container {
      padding: 0 24px;
      margin-top: 8px;
    }
  `]
})
export class IotPanelAlertsComponent {
  protected readonly store = inject(IotStore);
}
