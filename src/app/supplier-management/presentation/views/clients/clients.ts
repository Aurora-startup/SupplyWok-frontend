import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Client } from '../../../domain/model/client.entity';
import { SupplierManagementStore } from '../../../application/supplier-management-store';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FormsModule, TranslateModule, TableModule, InputTextModule, SelectModule, TagModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  readonly store = inject(SupplierManagementStore);
  private readonly translate = inject(TranslateService);
  searchQuery = '';
  statusFilter = 'all';
  readonly statusOptions = computed(() => [
    { label: this.translate.instant('supplier-management.clients.filters.all'), value: 'all' },
    { label: this.translate.instant('supplier-management.clients.filters.active'), value: 'active' }
  ]);

  get filteredClients(): Client[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.store.clients().filter((client) => {
      const matchesStatus = this.statusFilter === 'all' || client.status === this.statusFilter;
      const matchesQuery = !query || [client.name, client.district, client.frequency, client.status]
        .some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }

  ngOnInit(): void {
    this.store.loadClients();
  }
}
