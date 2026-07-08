import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryManagementStore } from '../../../application/inventory-management-store';
import { UnitOfMeasure } from '../../../domain/enums/unit-of-measure.enum';
import { InventoryCategory } from '../../../domain/model/inventory-category.entity';
import { InventoryItem } from '../../../domain/model/inventory-item.entity';
import { buildCategoryId } from '../../../infrastructure/inventory-item-assembler';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-inventory-items-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatInputModule, MatIconModule, TranslateModule],
  templateUrl: './inventory-item-form.html',
  styleUrl: './inventory-item-form.css',
})
export class InventoryItemForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(InventoryManagementStore);

  form = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    currentStock: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),

    minimumStockLevel: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),

    idCategory: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),

    idSupplier: new FormControl<number | null>(null, {
    }),

    unitOfMeasure: new FormControl<UnitOfMeasure | null>(null, {
      validators: [Validators.required],
    }),
  });

  categories = this.store.inventoryCategories;
  suppliers = this.store.suppliers;
  newCategoryName = new FormControl<string>('', { nonNullable: true });

  isEdit = false;
  itemId: number | null = null;

  constructor() {
    effect(() => {
      if (this.store.itemSaved()) {
        this.store.resetItemSaved();
        this.router.navigate(['/restaurant/inventory']);
      }
    });

    this.route.params.subscribe((params) => {
      this.itemId = params['id'] ? +params['id'] : null;

      this.isEdit = !!this.itemId;

      if (this.isEdit) {
        const item = this.store.inventoryItems().find((i) => i.id === this.itemId);

        if (item) {
          this.form.patchValue({
            name: item.name,
            currentStock: item.currentStock,
            minimumStockLevel: item.minimumStockLevel,
            idCategory: item.idCategory,
            idSupplier: item.idSupplier,
            unitOfMeasure: item.unitOfMeasure,
          });
        }
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const inventoryItem = new InventoryItem({
      id: this.itemId ?? 0,

      name: this.form.value.name!,

      currentStock: this.form.value.currentStock!,

      minimumStockLevel: this.form.value.minimumStockLevel!,

      idCategory: this.form.value.idCategory ?? 0,

      idSupplier: this.form.value.idSupplier ?? 0,

      unitOfMeasure: this.form.value.unitOfMeasure!,
      category: this.store.inventoryCategories().find((category) => category.id === (this.form.value.idCategory ?? 0)) ?? null,
      supplier: this.store.suppliers().find((supplier) => supplier.id === (this.form.value.idSupplier ?? 0)) ?? null,
    });

    if (this.isEdit) {
      this.store.updateInventoryItem(inventoryItem);
    } else {
      this.store.addInventoryItem(inventoryItem);
    }
  }

  addCategory(): void {
    const normalizedName = this.newCategoryName.value.trim();

    if (!normalizedName) {
      return;
    }

    const existingCategory = this.categories().find(
      (category) => category.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (existingCategory) {
      this.form.controls.idCategory.setValue(existingCategory.id);
      this.newCategoryName.setValue('');
      return;
    }

    const category = new InventoryCategory({
      id: buildCategoryId(normalizedName),
      name: normalizedName,
    });

    this.store.addInventoryCategory(category);
    this.form.controls.idCategory.setValue(category.id);
    this.newCategoryName.setValue('');
  }

  canAddCategory(): boolean {
    return this.newCategoryName.value.trim().length > 0;
  }

  onCancel(): void {
    void this.router.navigate(['/restaurant/inventory']);
  }
}
