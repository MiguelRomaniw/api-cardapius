export enum ProductTypes {
  Common = "Comum",
  Pizza = "Pizza",
}

const values = Object.values(ProductTypes);

export type ProductType = (typeof values)[number];
