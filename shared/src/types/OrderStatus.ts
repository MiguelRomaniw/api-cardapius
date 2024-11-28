export enum OrderStatuses {
  Waiting = "Aguardando",
  Accepted = "Aceito",
  Preparing = "Em preparação",
  Cancelled = "Cancelado",
  Finished = "Finalizado",
  inDelivery = "Em transporte",
  Delivered = "Entregue",
}

const values = Object.values(OrderStatuses);

export type OrderStatus = (typeof values)[number];
