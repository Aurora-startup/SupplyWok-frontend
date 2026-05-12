import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableService } from '../../../services/table.service';
import { Table } from '../../../model/table.entity';

@Component({
  selector: 'app-tables-and-occupancy',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './tables-and-occupancy.component.html',
  styleUrl: './tables-and-occupancy.component.css',
})
export class TablesAndOccupancyComponent implements OnInit {
  tables = signal<Table[]>([]);
  searchQuery = signal('');
  selectedZone = signal('');
  totalCapacity = signal(24);

  zones = computed(() => {
    const allZones = this.tables().map(t => t.zone);
    return [...new Set(allZones)];
  });

  filteredTables = computed(() => {
    let result = this.tables();
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(t =>
        `T-${String(t.number).padStart(2, '0')}`.toLowerCase().includes(query)
      );
    }
    const zone = this.selectedZone();
    if (zone) {
      result = result.filter(t => t.zone === zone);
    }
    return result;
  });

  occupiedCount = computed(() => this.tables().filter(t => t.status === 'OCCUPIED').length);
  freeCount = computed(() => this.tables().filter(t => t.status === 'FREE').length);
  occupancyPercent = computed(() => {
    const total = this.totalCapacity();
    return total > 0 ? Math.round((this.occupiedCount() / total) * 100) : 0;
  });

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.tableService.getTables().subscribe(tables => {
      this.tables.set(tables);
    });
  }

  getTableLabel(table: Table): string {
    return `T-${String(table.number).padStart(2, '0')}`;
  }

  getZoneLabel(zone: string): string {
    return zone.charAt(0).toUpperCase() + zone.slice(1).replace(/-/g, ' ');
  }

  getDwellTimeFormatted(table: Table): string {
    return this.tableService.formatDwellTime(table.dwellTime);
  }

  onCheckout(table: Table): void {
    this.tableService.updateTableStatus(table.id, 'FREE').subscribe(() => {
      this.tables.update(tables =>
        tables.map(t => t.id === table.id ? { ...t, status: 'FREE' as const, dwellTime: 0, sensorState: 'idle' as const } : t)
      );
    });
  }

  onAssignGuest(table: Table): void {
    this.tableService.updateTableStatus(table.id, 'OCCUPIED').subscribe(() => {
      this.tables.update(tables =>
        tables.map(t => t.id === table.id ? { ...t, status: 'OCCUPIED' as const, sensorState: 'active' as const } : t)
      );
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onZoneChange(value: string): void {
    this.selectedZone.set(value);
  }
}
