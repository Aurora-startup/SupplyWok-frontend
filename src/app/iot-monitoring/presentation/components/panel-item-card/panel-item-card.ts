import { Component, input } from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * A reusable panel item card for the IoT Monitoring dashboard.
 * Displays an icon, title, main value with unit, a progress bar, and a subtitle.
 */
@Component({
  selector: 'app-panel-item-card',
  imports: [NgClass, NgIf, NgStyle, TranslateModule],
  templateUrl: './panel-item-card.html',
  styleUrl: './panel-item-card.css',
})
export class PanelItemCard {
  /** Path to the icon SVG */
  readonly iconSrc = input.required<string>();

  /** Card title (e.g. 'KITCHEN') */
  readonly title = input.required<string>();

  /** Main numeric value */
  readonly value = input.required<number | null>();

  /** Unit to display next to the value (e.g. '°C', '%') */
  readonly unit = input.required<string>();

  /** Optional color class or hex for the value text. Default is standard text color. */
  readonly valueColor = input<string>('');

  /** Progress bar percentage (0-100) */
  readonly progressPercent = input.required<number>();

  /** Text displayed below the progress bar */
  readonly subtitle = input.required<string>();

  /** Optional parameters for the subtitle translation */
  readonly subtitleParams = input<Record<string, any>>({});

  /** Returns the display value, falling back to '—' when null */
  get displayValue(): string {
    const v = this.value();
    return v !== null && v !== undefined ? String(v) : '—';
  }
}
