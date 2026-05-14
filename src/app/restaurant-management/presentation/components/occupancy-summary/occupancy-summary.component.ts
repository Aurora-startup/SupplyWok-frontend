import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-occupancy-summary',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './occupancy-summary.component.html',
  styleUrl: './occupancy-summary.component.css',
})
export class OccupancySummaryComponent {
  @Input({ required: true }) occupiedCount!: number;
  @Input({ required: true }) freeCount!: number;
  @Input({ required: true }) occupancyPercent!: number;
  @Input({ required: true }) totalCapacity!: number;

  get occupiedDisplay(): string {
    return this.occupiedCount < 10 ? '0' + this.occupiedCount : String(this.occupiedCount);
  }

  get freeDisplay(): string {
    return this.freeCount < 10 ? '0' + this.freeCount : String(this.freeCount);
  }
}
