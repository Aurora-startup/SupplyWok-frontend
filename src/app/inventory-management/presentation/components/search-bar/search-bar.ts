// inventory-search-bar.component.ts
import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { InventoryCategory } from '../../../domain/model/inventory-category.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inventory-search-bar',
  standalone: true,
  imports: [MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class InventorySearchBar {
  // Inputs
  categories = input<InventoryCategory[]>([]);

  // Internal state
  protected searchValue = signal<string>('');
  protected categoryValue = signal<number | null>(null);

  // Outputs
  searchChange = output<string>();
  categoryChange = output<number | null>();

  protected onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.searchChange.emit(value);
  }

  protected onCategoryChange(value: number | null): void {
    this.categoryValue.set(value);
    this.categoryChange.emit(value);
  }
}
