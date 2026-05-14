export enum ComandaStatus {
  EN_COLA = 'EN_COLA',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO = 'LISTO',
  ENTREGADO = 'ENTREGADO',
}

export const COMANDA_STATUS_ORDER: ComandaStatus[] = [
  ComandaStatus.EN_COLA,
  ComandaStatus.EN_PREPARACION,
  ComandaStatus.LISTO,
  ComandaStatus.ENTREGADO,
];
