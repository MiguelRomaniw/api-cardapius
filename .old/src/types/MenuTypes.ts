export enum MenuTypes {
  Store = "store",
  Delivery = "delivery",
  All = "all",
}

const values = Object.values(MenuTypes);

export type MenuType = (typeof values)[number];
