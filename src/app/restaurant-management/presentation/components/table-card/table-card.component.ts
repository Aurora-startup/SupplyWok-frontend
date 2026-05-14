import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Table } from '../../../domain/model/table.entity';
import { RestaurantManagementStore } from '../../../application/restaurant-management.store';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.css',
})
export class TableCardComponent {
  @Input({ required: true }) table!: Table;
  @Output() checkout = new EventEmitter<Table>();
  @Output() assignGuest = new EventEmitter<Table>();

  constructor(private store: RestaurantManagementStore) {}

  get label(): string {
    return this.store.getTableLabel(this.table);
  }

  get zoneLabel(): string {
    return this.store.getZoneLabel(this.table.zone);
  }

  get dwellTime(): string {
    return this.store.getDwellTimeFormatted(this.table.dwellTime);
  }
}
