import { Component } from '@angular/core';
import { InventoryHeader } from '../../components/inventory-header/inventory-header';
import { InventoryItemsList } from '../../components/inventory-items-list/inventory-items-list';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [InventoryHeader, InventoryItemsList],
  template: `
    <app-inventory-header />
    <app-inventory-items-list />
  `
})
export class InventoryPageComponent {}
