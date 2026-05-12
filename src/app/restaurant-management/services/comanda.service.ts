import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Comanda, ComandaStatus } from '../model/comanda.entity';

const STATUS_ORDER: ComandaStatus[] = ['EN_COLA', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'];

@Injectable({ providedIn: 'root' })
export class ComandaService {
  private readonly apiUrl = 'http://localhost:3000/comandas';

  constructor(private http: HttpClient) {}

  getComandas(): Observable<Comanda[]> {
    return this.http.get<Comanda[]>(this.apiUrl);
  }

  getComandaById(id: number): Observable<Comanda> {
    return this.http.get<Comanda>(`${this.apiUrl}/${id}`);
  }

  createComanda(comanda: Partial<Comanda>): Observable<Comanda> {
    if (!comanda.tableId || !comanda.items?.length) {
      return throwError(() => new Error('Table and items are required'));
    }
    const now = new Date().toISOString();
    return this.http.post<Comanda>(this.apiUrl, {
      ...comanda,
      status: 'EN_COLA' as ComandaStatus,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateComandaStatus(id: number, newStatus: ComandaStatus, currentStatus: ComandaStatus): Observable<Comanda> {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const newIndex = STATUS_ORDER.indexOf(newStatus);
    if (newIndex <= currentIndex) {
      return throwError(() => new Error('Status can only progress forward'));
    }
    return this.http.patch<Comanda>(`${this.apiUrl}/${id}`, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  }

  getElapsedTime(createdAt: string): string {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  getNextStatus(current: ComandaStatus): ComandaStatus | null {
    const index = STATUS_ORDER.indexOf(current);
    return index < STATUS_ORDER.length - 1 ? STATUS_ORDER[index + 1] : null;
  }
}
