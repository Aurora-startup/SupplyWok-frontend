import { Component, input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/** Badge severity visual styles */
export type BadgeSeverity = 'urgent' | 'alert' | 'ok' | 'info';

/**
 * A reusable analytics summary card for the IoT Monitoring dashboard.
 * Accepts an icon path, a numeric value, a label, and an optional badge.
 */
@Component({
  selector: 'app-iot-stat-card',
  imports: [NgClass, NgIf, TranslateModule],
  templateUrl: './iot-stat-card.html',
  styleUrl: './iot-stat-card.css',
})
export class IotStatCard {
  /** Path to the icon SVG, relative to public/assets */
  readonly iconSrc = input.required<string>();

  /** The large numeric value to display */
  readonly value = input.required<number | string | null>();

  /** Label shown below the value */
  readonly label = input.required<string>();

  /** Text to display inside the badge (e.g. 'Urgent', 'Alert') */
  readonly badgeLabel = input<string>('');

  /** Controls the color scheme of the badge */
  readonly badgeSeverity = input<BadgeSeverity>('info');

  /** Whether to show the badge at all */
  readonly showBadge = input<boolean>(true);

  /** Returns the display value, falling back to '—' when null/undefined */
  get displayValue(): string {
    const v = this.value();
    return v !== null && v !== undefined ? String(v) : '—';
  }
}
