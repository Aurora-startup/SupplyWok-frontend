import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Comanda } from '../../../domain/model/comanda.entity';
import { ComandaStatus } from '../../../domain/enums/comanda-status.enum';
import { RestaurantManagementStore } from '../../../application/restaurant-management.store';

@Component({
  selector: 'app-comanda-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './comanda-card.component.html',
  styleUrl: './comanda-card.component.css',
})
export class ComandaCardComponent {
  @Input({ required: true }) comanda!: Comanda;
  @Output() advance = new EventEmitter<Comanda>();

  constructor(private store: RestaurantManagementStore) {}

  get tableLabel(): string {
    return `T-${String(this.comanda.tableNumber).padStart(2, '0')}`;
  }

  get elapsedTime(): string {
    return this.store.getElapsedTime(this.comanda.createdAt);
  }

  get nextStatus(): ComandaStatus | null {
    return this.store.getNextStatus(this.comanda.status);
  }
}
