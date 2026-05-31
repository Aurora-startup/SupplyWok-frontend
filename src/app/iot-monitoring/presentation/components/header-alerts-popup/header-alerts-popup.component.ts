import { Component, inject, input } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertItemComponent } from '../alert-item/alert-item.component';
import { IotStore } from '../../../application/iot-store';

/**
 * A popup component that displays the top 5 critical alerts.
 * Designed to be toggled from a header notification icon.
 */
@Component({
  selector: 'app-header-alerts-popup',
  imports: [NgFor, NgIf, NgClass, TranslateModule, AlertItemComponent],
  template: `
    <div class="alerts-popup-container" *ngIf="isOpen()">
      <div class="popup-header">
        <span class="popup-title">{{ 'iot.alerts.notifications' | translate }}</span>
        <span class="popup-count" *ngIf="store.topCriticalAlerts().length > 0">
          {{ store.topCriticalAlerts().length }}
        </span>
      </div>
      
      <div class="popup-content">
        <app-alert-item 
          *ngFor="let alert of store.topCriticalAlerts()" 
          [alert]="alert">
        </app-alert-item>
        
        <div class="empty-state" *ngIf="store.topCriticalAlerts().length === 0">
          {{ 'iot.alerts.no-active-alerts' | translate }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alerts-popup-container {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 360px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid #eaeaea;
      z-index: 1000;
      overflow: hidden;
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #fafafa;
      border-bottom: 1px solid #eaeaea;
    }

    .popup-title {
      font-weight: 600;
      color: #333;
    }

    .popup-count {
      background: #f15252;
      color: white;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .popup-content {
      max-height: 400px;
      overflow-y: auto;
      padding: 0 20px;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: #888;
      font-size: 13px;
    }
  `]
})
export class HeaderAlertsPopupComponent {
  protected readonly store = inject(IotStore);
  readonly isOpen = input<boolean>(false);
}
