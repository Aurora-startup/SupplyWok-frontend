import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './inventory-header.html',
  styleUrl: './inventory-header.css',
})
export class InventoryHeader {
  private router = inject(Router);

  protected onAddSupply(): void {
    this.router.navigate(['/restaurant/inventory/new']);
  }
}
