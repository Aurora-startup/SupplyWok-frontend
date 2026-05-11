import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { KitchenPanelCard } from '../kitchen-panel-card/kitchen-panel-card';
import { StoragePanelCard } from '../storage-panel-card/storage-panel-card';
import { DiningPanelCard } from '../dining-panel-card/dining-panel-card';
import { IotPanelAlertsComponent } from '../iot-panel-alerts/iot-panel-alerts.component';

@Component({
  selector: 'app-iot-panel-card',
  imports: [TranslateModule, KitchenPanelCard, StoragePanelCard, DiningPanelCard, IotPanelAlertsComponent],
  templateUrl: './iot-panel-card.html',
  styleUrl: './iot-panel-card.css',
})
export class IotPanelCard {}
