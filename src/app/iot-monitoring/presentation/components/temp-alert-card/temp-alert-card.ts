import { Component, inject } from '@angular/core';
import { IotStatCard } from '../iot-stat-card/iot-stat-card';
import { IotStore } from '../../../application/iot-store';

/**
 * Displays the count of temperature sensors currently out of operational range.
 * Shows an 'Alert' badge when any sensor is out of range.
 */
@Component({
  selector: 'app-temp-alert-card',
  imports: [IotStatCard],
  templateUrl: './temp-alert-card.html',
  styleUrl: './temp-alert-card.css'
})
export class TempAlertCard {
  protected readonly store = inject(IotStore);
}
