export type ComandaStatus = 'EN_COLA' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO';

export interface ComandaItem {
  id: number;
  dishName: string;
  quantity: number;
}

export interface Comanda {
  id: number;
  tableId: number;
  tableNumber: number;
  items: ComandaItem[];
  status: ComandaStatus;
  createdAt: string;
  updatedAt: string;
}
