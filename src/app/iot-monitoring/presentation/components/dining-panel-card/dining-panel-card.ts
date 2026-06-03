import { Component, inject } from '@angular/core';
import { PanelItemCard } from '../panel-item-card/panel-item-card';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-dining-panel-card',
  imports: [PanelItemCard],
  templateUrl: './dining-panel-card.html',
  styleUrl: './dining-panel-card.css'
})
export class DiningPanelCard {
  protected readonly store = inject(IotStore);
}
