import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table, TableStatus } from '../model/table.entity';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly apiUrl = 'http://localhost:3000/tables';

  constructor(private http: HttpClient) {}

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  getTableById(id: number): Observable<Table> {
    return this.http.get<Table>(`${this.apiUrl}/${id}`);
  }

  updateTableStatus(id: number, status: TableStatus): Observable<Table> {
    return this.http.patch<Table>(`${this.apiUrl}/${id}`, { status });
  }

  formatDwellTime(seconds: number): string {
    if (seconds <= 0) return '-- : --';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    return `${minutes}m ${String(secs).padStart(2, '0')}s`;
  }
}
