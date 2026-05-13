// inventory-header.component.ts
import { Component, output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-inventory-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './inventory-header.html',
  styleUrl: './inventory-header.css',
})
export class InventoryHeader {
  addSupply = output<void>();

  protected onAddSupply(): void {
    this.addSupply.emit();
  }

  //private router = inject(Router);

  //goToAddItem(): void {
  ///  this.router.navigate(['/inventory/inventoryItems/new']);
 // }
}
