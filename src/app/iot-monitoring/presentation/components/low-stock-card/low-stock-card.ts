import { Component, inject } from '@angular/core';
import { IotStatCard } from '../iot-stat-card/iot-stat-card';
import { IotStore } from '../../../application/iot-store';

/**
 * Displays the low stock count from storage pressure sensors.
 * Shows an 'Urgent' badge when any sensor reports low stock.
 */
@Component({
  selector: 'app-low-stock-card',
  imports: [IotStatCard],
  template: `
    <app-iot-stat-card
      iconSrc="assets/images/icons/iot/iot-low-stock-icon.svg"
      [value]="store.lowStockStorageCount()"
      label="iot.stat-cards.low-stock-items"
      [badgeLabel]="store.lowStockStorageCount() > 0 ? 'iot.stat-cards.urgent' : ''"
      [badgeSeverity]="'urgent'"
      [showBadge]="store.lowStockStorageCount() > 0"
    />
  `,
})
export class LowStockCard {
  protected readonly store = inject(IotStore);
}
