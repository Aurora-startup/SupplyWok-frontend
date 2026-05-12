import { Component, signal } from '@angular/core';
import { SidebarMenu } from './shared/presentation/components/sidebar-menu/sidebar-menu';
import { HeaderContent } from './shared/presentation/components/header-content/header-content';
import { InventoryItemsList} from './inventory-management/presentation/components/inventory-items-list/inventory-items-list';
import { InventoryHeader} from './inventory-management/presentation/components/inventory-header/inventory-header';
import { InventorySearchBar } from './inventory-management/presentation/components/search-bar/search-bar';
import { InventoryItemForm} from './inventory-management/presentation/components/inventory-item-form/inventory-item-form';
import { DeleteItemDialog} from './inventory-management/presentation/components/delete-item-dialog/delete-item-dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [
    HeaderContent,
    SidebarMenu,
    InventoryItemsList,
    InventoryHeader,
    InventorySearchBar,
    InventoryItemForm,
    DeleteItemDialog,
    MatDialogModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SupplyWok-fronted');
}
