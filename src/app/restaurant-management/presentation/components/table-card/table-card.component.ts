import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Table } from '../../../domain/model/table.entity';
import { TableAssembler } from '../../../infrastructure/table.assembler';

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

  get label(): string {
    return TableAssembler.toLabel(this.table);
  }

  get zoneLabel(): string {
    return TableAssembler.toZoneLabel(this.table.zone);
  }

  get dwellTime(): string {
    return TableAssembler.toDwellTimeFormatted(this.table.dwellTime);
  }
}
