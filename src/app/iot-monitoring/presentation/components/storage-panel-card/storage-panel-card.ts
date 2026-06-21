import { Component, inject } from '@angular/core';
import { PanelItemCard } from '../panel-item-card/panel-item-card';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-storage-panel-card',
  imports: [PanelItemCard],
  templateUrl: './storage-panel-card.html',
  styleUrl: './storage-panel-card.css'
})
export class StoragePanelCard {
  protected readonly store = inject(IotStore);

  protected getProgress(): number {
    const value = this.store.averageStorageTemperature();
    if (value === null) return 0;
    const percent = ((value + 5) / 15) * 100;
    return Math.max(0, Math.min(100, percent));
  }
}
