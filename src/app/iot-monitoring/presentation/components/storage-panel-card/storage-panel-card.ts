import { Component, inject } from '@angular/core';
import { PanelItemCard } from '../panel-item-card/panel-item-card';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-storage-panel-card',
  imports: [PanelItemCard],
  template: `
    <app-panel-item-card
      iconSrc="assets/images/icons/iot/iot-storage-icon.svg"
      title="iot.panel.cold-storage"
      [value]="store.averageStorageTemperature()"
      unit="°C"
      valueColor="#3b82f6"
      [progressPercent]="getProgress()"
      subtitle="iot.panel.optimal-range"
      [subtitleParams]="{ min: 2, max: 5 }"
    />
  `,
})
export class StoragePanelCard {
  protected readonly store = inject(IotStore);

  protected getProgress(): number {
    const val = this.store.averageStorageTemperature();
    if (val === null) return 0;
    // Map -5 to 10 range to 0-100%
    const percent = ((val + 5) / (10 + 5)) * 100;
    return Math.max(0, Math.min(100, percent));
  }
}
