import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryManagementStore } from '../../../../inventory-management/application/inventory-management-store';
import { Supplier } from '../../../../inventory-management/domain/model/supplier.entity';
import { ProfileApi } from '../../../../profile-management/infrastructure/profile-api';
import { Profile } from '../../../../profile-management/domain/model/profile.entity';

interface SupplierDirectoryRow {
  id: number | string;
  name: string;
  email: string;
  categories: string[];
  lowStockItems: number;
  street: string;
  supportContact: string;
}

@Component({
  selector: 'app-suppliers-page',
  imports: [CommonModule, TranslateModule],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.css'
})
export class SuppliersPageComponent implements OnInit {
  private readonly inventoryStore = inject(InventoryManagementStore);
  private readonly profileApi = inject(ProfileApi);
  private readonly itemsPerPage = 5;
  private readonly currentPage = signal(1);
  private readonly supplierProfiles = signal<Profile[]>([]);

  protected readonly supplierRows = computed<SupplierDirectoryRow[]>(() =>
    this.buildSupplierRows()
  );

  protected readonly totalLowStockItems = computed(() =>
    this.inventoryStore.inventoryItems().filter((item) => item.currentStock <= item.minimumStockLevel).length
  );

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.supplierRows().length / this.itemsPerPage))
  );

  protected readonly visibleSupplierRows = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.supplierRows().slice(start, start + this.itemsPerPage);
  });

  protected readonly paginationSummary = computed(() => {
    const total = this.supplierRows().length;
    if (!total) {
      return { from: 0, to: 0, total: 0 };
    }

    const from = (this.currentPage() - 1) * this.itemsPerPage + 1;
    const to = Math.min(this.currentPage() * this.itemsPerPage, total);
    return { from, to, total };
  });

  protected readonly canGoPrevious = computed(() => this.currentPage() > 1);
  protected readonly canGoNext = computed(() => this.currentPage() < this.totalPages());

  ngOnInit(): void {
    this.inventoryStore.refreshSuppliers();

    this.profileApi.getProfilesByType('supplier').subscribe({
      next: (profiles) => {
        this.supplierProfiles.set(profiles);
        this.currentPage.set(1);
      },
      error: () => {
        this.supplierProfiles.set([]);
      }
    });
  }

  protected goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.currentPage.update((page) => page - 1);
    }
  }

  protected goToNextPage(): void {
    if (this.canGoNext()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  private buildSupplierRows(): SupplierDirectoryRow[] {
    const suppliersByEmail = new Map(
      this.inventoryStore.suppliers()
        .filter((supplier) => supplier.email.trim())
        .map((supplier) => [supplier.email.trim().toLowerCase(), supplier])
    );
    const rowsFromProfiles = this.supplierProfiles().map((profile) => {
      const profileEmail = profile.email.trim().toLowerCase();
      const supplier = suppliersByEmail.get(profileEmail);
      const displayName = this.getSupplierDisplayName(profile.email, profile, supplier?.name);
      return this.buildSupplierRow(
        new Supplier({
          id: supplier?.id ?? (`profile-${profile.id}` as unknown as number),
          name: displayName,
          email: supplier?.email || profile.email
        }),
        profile,
        profile.email
      );
    });

    return rowsFromProfiles.sort((first, second) => first.name.localeCompare(second.name));
  }

  private buildSupplierRow(supplier: Supplier, profile: Profile, email = supplier.email): SupplierDirectoryRow {
    const relatedItems = this.inventoryStore.inventoryItems().filter((item) => item.idSupplier === supplier.id);
    const categories = [...new Set(
      relatedItems
        .map((item) => item.category?.name ?? this.inventoryStore.getCategoryName(item.idCategory))
        .filter((value) => Boolean(value) && value !== 'None')
    )];
    const lowStockItems = relatedItems.filter((item) => item.currentStock <= item.minimumStockLevel).length;

    return {
      id: supplier.id,
      name: supplier.name,
      email,
      categories: categories.length ? categories : ['General'],
      lowStockItems,
      street: profile.street || '-',
      supportContact: profile.supportContact || '-'
    };
  }

  private getSupplierDisplayName(email: string, profile?: Profile, supplierName?: string): string {
    if (profile?.businessName.trim()) {
      return profile.businessName.trim();
    }

    if (supplierName?.trim()) {
      return supplierName.trim();
    }

    return email.split('@')[0] || email;
  }
}
