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
  templateUrl: './low-stock-card.html',
  styleUrl: './low-stock-card.css'
})
export class LowStockCard {
  protected readonly store = inject(IotStore);
}
