import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RestaurantManagementStore } from '../../../application/restaurant-management.store';
import { Table } from '../../../domain/model/table.entity';
import { TableCardComponent } from '../../components/table-card/table-card.component';
import { OccupancySummaryComponent } from '../../components/occupancy-summary/occupancy-summary.component';

@Component({
  selector: 'app-tables-and-occupancy',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TableCardComponent, OccupancySummaryComponent],
  templateUrl: './tables-and-occupancy.component.html',
  styleUrl: './tables-and-occupancy.component.css',
})
export class TablesAndOccupancyComponent implements OnInit {
  searchQuery = signal('');
  selectedZone = signal('');

  filteredTables = computed(() => {
    let result = this.store.tables();
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(t =>
        this.store.getTableLabel(t).toLowerCase().includes(query)
      );
    }
    const zone = this.selectedZone();
    if (zone) {
      result = result.filter(t => t.zone === zone);
    }
    return result;
  });

  constructor(protected store: RestaurantManagementStore) {}

  ngOnInit(): void {
    this.store.loadTables();
  }

  onCheckout(table: Table): void {
    this.store.checkoutTable(table);
  }

  onAssignGuest(table: Table): void {
    this.store.assignGuest(table);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onZoneChange(value: string): void {
    this.selectedZone.set(value);
  }
}
