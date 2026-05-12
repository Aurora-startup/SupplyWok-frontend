import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Comanda, ComandaStatus } from '../../../domain/model/comanda.entity';
import { ComandaAssembler } from '../../../infrastructure/comanda.assembler';

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

  get tableLabel(): string {
    return `T-${String(this.comanda.tableNumber).padStart(2, '0')}`;
  }

  get elapsedTime(): string {
    return ComandaAssembler.toElapsedTime(this.comanda.createdAt);
  }

  get nextStatus(): ComandaStatus | null {
    return ComandaAssembler.getNextStatus(this.comanda.status);
  }
}
