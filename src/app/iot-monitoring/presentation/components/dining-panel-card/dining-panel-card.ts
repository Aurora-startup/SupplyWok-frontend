import { Component, inject } from '@angular/core';
import { PanelItemCard } from '../panel-item-card/panel-item-card';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-dining-panel-card',
  imports: [PanelItemCard],
  template: `
    <app-panel-item-card
      iconSrc="assets/images/icons/iot/iot-dining-icon.svg"
      title="iot.panel.dining-room"
      [value]="store.occupiedTablePercentage()"
      unit="%"
      [progressPercent]="store.occupiedTablePercentage() ?? 0"
      subtitle="iot.panel.occupancy-rate"
    />
  `,
})
export class DiningPanelCard {
  protected readonly store = inject(IotStore);
}
