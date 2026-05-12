import { Component, inject } from '@angular/core';
import { InventoryManagementStore } from '../../../application/inventory-management-store';
import { Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { InventoryItem } from '../../../domain/model/inventory-item.entity';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-inventory-items-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatError,
    MatProgressSpinner,
    MatIconModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './inventory-items-list.html',
  styleUrl: './inventory-items-list.css',
})
export class InventoryItemsList {
  readonly store = inject(InventoryManagementStore);
  protected router = inject(Router);
  protected readonly min = Math.min;

  // inventory-items-list.ts — métodos helper que necesitas agregar al componente

  // Agrega estas propiedades y métodos a tu clase InventoryItemsList:

  protected displayedColumns = ['product', 'stockLevels', 'category', 'supplier', 'actions'];

  // Determina el estado del stock: 'good' | 'low' | 'refill'
  protected getStockClass(item: InventoryItem): string {
    const ratio = item.currentStock / item.minimumStockLevel;
    if (ratio >= 1.5) return 'good';
    if (ratio >= 1) return 'low';
    return 'refill';
  }

  // Porcentaje para la barra (máx 100%, usando 3x el mínimo como "full")
  protected getStockPercent(item: InventoryItem): number {
    const full = item.minimumStockLevel * 3;
    return Math.min((item.currentStock / full) * 100, 100);
  }

  protected onEdit(item: InventoryItem): void {
    // TODO: abrir dialog de edición
    console.log('Edit', item);
  }

  deleteInventoryItem(id: number) {
    this.store.deleteInventoryItem(id);
  }
}
