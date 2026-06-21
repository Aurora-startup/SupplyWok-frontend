import { Component, input } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Alert } from '../../../domain/model/alert.entity';

/**
 * A reusable component to render a single alert item row.
 */
@Component({
  selector: 'app-alert-item',
  imports: [NgClass, DatePipe, TranslateModule],
  templateUrl: './alert-item.component.html',
  styleUrl: './alert-item.component.css',
})
export class AlertItemComponent {
  /** The alert domain entity to render */
  readonly alert = input.required<Alert>();
}
