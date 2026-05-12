import { Table } from '../domain/model/table.entity';

export class TableAssembler {
  static toLabel(table: Table): string {
    return `T-${String(table.number).padStart(2, '0')}`;
  }

  static toZoneLabel(zone: string): string {
    return zone.charAt(0).toUpperCase() + zone.slice(1).replace(/-/g, ' ');
  }

  static toDwellTimeFormatted(seconds: number): string {
    if (seconds <= 0) return '-- : --';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    return `${minutes}m ${String(secs).padStart(2, '0')}s`;
  }
}
