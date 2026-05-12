import { Comanda, ComandaStatus, COMANDA_STATUS_ORDER } from '../domain/model/comanda.entity';

export class ComandaAssembler {
  static toElapsedTime(createdAt: string): string {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  static getNextStatus(current: ComandaStatus): ComandaStatus | null {
    const index = COMANDA_STATUS_ORDER.indexOf(current);
    return index < COMANDA_STATUS_ORDER.length - 1 ? COMANDA_STATUS_ORDER[index + 1] : null;
  }

  static canAdvance(currentStatus: ComandaStatus, newStatus: ComandaStatus): boolean {
    return COMANDA_STATUS_ORDER.indexOf(newStatus) > COMANDA_STATUS_ORDER.indexOf(currentStatus);
  }

  static toCreatePayload(comanda: Partial<Comanda>): Partial<Comanda> {
    const now = new Date().toISOString();
    return {
      ...comanda,
      status: 'EN_COLA' as ComandaStatus,
      createdAt: now,
      updatedAt: now,
    };
  }
}
