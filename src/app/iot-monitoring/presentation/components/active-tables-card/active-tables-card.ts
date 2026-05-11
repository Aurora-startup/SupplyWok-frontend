import { Component, inject } from '@angular/core';
import { IotStatCard } from '../iot-stat-card/iot-stat-card';
import { IotStore } from '../../../application/iot-store';

/**
 * Displays the total count of active (occupied) tables based on table pressure sensors.
 * Shows an 'Alert' badge when at least one table is occupied.
 */
@Component({
  selector: 'app-active-tables-card',
  imports: [IotStatCard],
  template: `
    <app-iot-stat-card
      iconSrc="assets/images/icons/iot/iot-dining-icon.svg"
      [value]="activeTableCount()"
      label="iot.stat-cards.active-tables"
      [badgeLabel]="(activeTableCount() ?? 0) > 0 ? 'iot.stat-cards.alert' : ''"
      [badgeSeverity]="'alert'"
      [showBadge]="(activeTableCount() ?? 0) > 0"
    />
  `,
})
export class ActiveTablesCard {
  protected readonly store = inject(IotStore);

  /**
   * Derives absolute occupied table count from the percentage signal
   * and total table sensor count.
   */
  protected activeTableCount(): number | null {
    const pct = this.store.occupiedTablePercentage();
    if (pct === null) return null;
    const tables = this.store.sensors().filter(s => s.type === 'table-pressure');
    return Math.round((pct / 100) * tables.length);
  }
}
