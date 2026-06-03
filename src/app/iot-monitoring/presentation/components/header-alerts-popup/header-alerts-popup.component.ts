import { Component, Input, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertItemComponent } from '../alert-item/alert-item.component';
import { IotStore } from '../../../application/iot-store';

@Component({
  selector: 'app-header-alerts-popup',
  imports: [NgFor, NgIf, TranslateModule, AlertItemComponent],
  templateUrl: './header-alerts-popup.component.html',
  styleUrl: './header-alerts-popup.component.css'
})
export class HeaderAlertsPopupComponent {
  @Input() isOpen = false;
  protected readonly store = inject(IotStore);
}
