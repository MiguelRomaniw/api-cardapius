export enum OrderTypes {
  Delivery = "Entrega",
  PickUp = "Retirada",
}

const values = Object.values(OrderTypes);

export type OrderType = (typeof values)[number];
