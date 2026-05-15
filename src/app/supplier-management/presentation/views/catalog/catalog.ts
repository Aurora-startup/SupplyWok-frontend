import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { map } from 'rxjs/operators';
import { SupplierManagementStore } from '../../../application/supplier-management-store';
import { CatalogItem } from '../../../domain/model/catalog-item.entity';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule, TranslateModule, TableModule, ButtonModule, InputTextModule, InputNumberModule, DialogModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  readonly store = inject(SupplierManagementStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly itemId = toSignal(this.route.paramMap.pipe(map((params) => params.get('itemId'))), { initialValue: null });

  searchQuery = '';
  deleteDialogVisible = false;
  itemToDelete: CatalogItem | null = null;
  formModel = new CatalogItem();

  readonly isFormRoute = computed(() => {
    const path = this.route.snapshot.routeConfig?.path ?? '';
    return path === 'supplier/catalog/new' || path === 'supplier/catalog/:itemId/edit';
  });
  readonly isEditing = computed(() => !!this.itemId());
  readonly selectedItem = computed(() => this.store.getCatalogItemById(this.itemId()));
  readonly submitLabelKey = computed(() => (this.isEditing()
    ? 'supplier-management.catalog.form.save'
    : 'supplier-management.catalog.form.add'));

  constructor() {
    effect(() => {
      const item = this.selectedItem();
      if (this.isEditing() && item) {
        this.formModel = new CatalogItem({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          unit: item.unit,
          deliveryConditions: item.deliveryConditions
        });
      }
    });
  }

  get filteredCatalogItems(): CatalogItem[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.store.catalogItems().filter((item) => !query || [item.name, item.category, item.unit, item.deliveryConditions]
      .some((value) => value.toLowerCase().includes(query)));
  }

  ngOnInit(): void {
    this.store.loadCatalogItems();
  }

  openCreateForm(): void {
    this.formModel = new CatalogItem();
    void this.router.navigate(['/supplier/catalog/new']);
  }

  openEditForm(item: CatalogItem): void {
    void this.router.navigate(['/supplier/catalog', item.id, 'edit']);
  }

  cancelForm(): void {
    this.formModel = new CatalogItem();
    void this.router.navigate(['/supplier/catalog']);
  }

  saveForm(): void {
    if (this.isEditing()) {
      this.store.updateCatalogItem(this.formModel);
    } else {
      this.store.createCatalogItem(this.formModel);
    }
    this.cancelForm();
  }

  openDeleteDialog(item: CatalogItem): void {
    this.itemToDelete = item;
    this.deleteDialogVisible = true;
  }

  closeDeleteDialog(): void {
    this.deleteDialogVisible = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {
    if (this.itemToDelete?.id != null) {
      this.store.deleteCatalogItem(this.itemToDelete.id);
    }
    this.closeDeleteDialog();
  }
}
