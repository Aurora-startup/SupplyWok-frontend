import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { AlertItemComponent } from '../alert-item/alert-item.component';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-iot-panel-alerts',
  imports: [NgFor, AlertItemComponent],
  templateUrl: './iot-panel-alerts.component.html',
  styleUrl: './iot-panel-alerts.component.css'
})
export class IotPanelAlertsComponent {
  protected readonly store = inject(IotStore);
}
