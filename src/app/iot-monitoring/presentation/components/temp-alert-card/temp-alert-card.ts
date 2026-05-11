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
  template: `
    <app-iot-stat-card
      iconSrc="assets/images/icons/iot/iot-temp-alert-icon.svg"
      [value]="store.outOfRangeTemperatureCount()"
      label="iot.stat-cards.temp-alerts"
      [badgeLabel]="store.outOfRangeTemperatureCount() > 0 ? 'iot.stat-cards.alert' : ''"
      [badgeSeverity]="'alert'"
      [showBadge]="store.outOfRangeTemperatureCount() > 0"
    />
  `,
})
export class TempAlertCard {
  protected readonly store = inject(IotStore);
}
