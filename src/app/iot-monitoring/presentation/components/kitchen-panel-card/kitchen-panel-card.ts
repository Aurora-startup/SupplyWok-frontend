import { Component, inject } from '@angular/core';
import { PanelItemCard } from '../panel-item-card/panel-item-card';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-kitchen-panel-card',
  imports: [PanelItemCard],
  template: `
    <app-panel-item-card
      iconSrc="assets/images/icons/iot/iot-kitchen-icon.svg"
      title="iot.panel.kitchen"
      [value]="store.averageKitchenTemperature()"
      unit="°C"
      [progressPercent]="getProgress()"
      subtitle="iot.panel.optimal-range"
      [subtitleParams]="{ min: 20, max: 26 }"
    />
  `,
})
export class KitchenPanelCard {
  protected readonly store = inject(IotStore);

  protected getProgress(): number {
    const val = this.store.averageKitchenTemperature();
    if (val === null) return 0;
    // Map 15-30 range to 0-100% for visual effect
    const percent = ((val - 15) / (30 - 15)) * 100;
    return Math.max(0, Math.min(100, percent));
  }
}
