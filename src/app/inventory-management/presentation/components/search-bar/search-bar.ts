// inventory-search-bar.component.ts
import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { InventoryCategory } from '../../../domain/model/inventory-category.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-inventory-search-bar',
  standalone: true,
  imports: [MatIconModule, MatSelectModule, TranslateModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class InventorySearchBar {
  private readonly defaultCategoryTranslationKeys: Record<string, string> = {
    grains: 'inventory.categories.grains',
    proteins: 'inventory.categories.proteins',
    vegetables: 'inventory.categories.vegetables',
    sauces: 'inventory.categories.sauces',
    beverages: 'inventory.categories.beverages',
    packaging: 'inventory.categories.packaging',
  };

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

  protected getCategoryTranslationKey(category: InventoryCategory): string | null {
    return this.defaultCategoryTranslationKeys[category.name.trim().toLowerCase()] ?? null;
  }
}
