import { Component } from '@angular/core';
import { InventoryHeader } from '../../components/inventory-header/inventory-header';
import { InventorySearchBar } from '../../components/search-bar/search-bar';
import { InventoryItemsList } from '../../components/inventory-items-list/inventory-items-list';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [InventoryHeader, InventorySearchBar, InventoryItemsList],
  template: `
    <app-inventory-header />
    <app-inventory-search-bar />
    <app-inventory-items-list />
  `
})
export class InventoryPageComponent {}
