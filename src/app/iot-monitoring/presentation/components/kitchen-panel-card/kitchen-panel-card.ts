import { Component, inject } from '@angular/core';
import { PanelItemCard } from '../panel-item-card/panel-item-card';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-kitchen-panel-card',
  imports: [PanelItemCard],
  templateUrl: './kitchen-panel-card.html',
  styleUrl: './kitchen-panel-card.css'
})
export class KitchenPanelCard {
  protected readonly store = inject(IotStore);

  protected getProgress(): number {
    const value = this.store.averageKitchenTemperature();
    if (value === null) return 0;
    const percent = ((value - 15) / 15) * 100;
    return Math.max(0, Math.min(100, percent));
  }
}
