import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IamApi } from '../../../../iam/infrastructure/iam-api';
import { User } from '../../../../iam/domain/model/user.entity';
import { InventoryManagementStore } from '../../../../inventory-management/application/inventory-management-store';
import { Supplier } from '../../../../inventory-management/domain/model/supplier.entity';
import { ProfileApi } from '../../../../profile-management/infrastructure/profile-api';
import { Profile } from '../../../../profile-management/domain/model/profile.entity';
import { catchError, forkJoin, of } from 'rxjs';

interface SupplierDirectoryRow {
  id: number | string;
  name: string;
  email: string;
  linkedItems: number;
  categories: string[];
  lowStockItems: number;
  coverageLabel: 'healthy' | 'watch' | 'critical';
}

@Component({
  selector: 'app-suppliers-page',
  imports: [CommonModule, TranslateModule],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.css'
})
export class SuppliersPageComponent implements OnInit {
  private readonly inventoryStore = inject(InventoryManagementStore);
  private readonly iamApi = inject(IamApi);
  private readonly profileApi = inject(ProfileApi);
  private readonly itemsPerPage = 5;
  private readonly currentPage = signal(1);
  private readonly supplierUsers = signal<User[]>([]);
  private readonly supplierProfiles = signal<Profile[]>([]);

  protected readonly supplierRows = computed<SupplierDirectoryRow[]>(() =>
    this.buildSupplierRows()
  );

  protected readonly totalLinkedItems = computed(() =>
    this.supplierRows().reduce((sum, row) => sum + row.linkedItems, 0)
  );

  protected readonly totalLowStockItems = computed(() =>
    this.supplierRows().reduce((sum, row) => sum + row.lowStockItems, 0)
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

    this.iamApi.getUsers().subscribe({
      next: (users) => {
        const supplierUsers = users.filter((user) => user.roles.includes('ROLE_SUPPLIER'));
        this.supplierUsers.set(supplierUsers);
        this.loadSupplierProfiles(supplierUsers);
        this.currentPage.set(1);
      },
      error: () => {
        this.supplierUsers.set([]);
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
    const profilesByEmail = new Map(
      this.supplierProfiles()
        .filter((profile) => profile.email.trim())
        .map((profile) => [profile.email.trim().toLowerCase(), profile])
    );
    const rowsFromUsers = this.supplierUsers().map((user) => {
      const userEmail = user.email.trim().toLowerCase();
      const supplier = suppliersByEmail.get(userEmail);
      const profile = profilesByEmail.get(userEmail);
      const displayName = this.getSupplierDisplayName(user.email, profile, supplier?.name);
      return this.buildSupplierRow(
        new Supplier({
          id: supplier?.id ?? (`user-${user.id}` as unknown as number),
          name: displayName,
          email: supplier?.email || user.email
        }),
        user.email
      );
    });

    return rowsFromUsers.sort((first, second) => first.name.localeCompare(second.name));
  }

  private buildSupplierRow(supplier: Supplier, email = supplier.email): SupplierDirectoryRow {
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
      linkedItems: relatedItems.length,
      categories: categories.length ? categories : ['General'],
      lowStockItems,
      coverageLabel: lowStockItems === 0 ? 'healthy' : lowStockItems >= 3 ? 'critical' : 'watch'
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

  private loadSupplierProfiles(users: User[]): void {
    if (!users.length) {
      this.supplierProfiles.set([]);
      return;
    }

    forkJoin(
      users.map((user) =>
        this.profileApi.getProfileByAccountEmail('supplier', user.email).pipe(
          catchError(() => of(null))
        )
      )
    ).subscribe((profiles) => {
      this.supplierProfiles.set(
        profiles.filter((profile): profile is Profile =>
          profile !== null && profile.id !== null && profile.profileType === 'supplier'
        )
      );
    });
  }
}
