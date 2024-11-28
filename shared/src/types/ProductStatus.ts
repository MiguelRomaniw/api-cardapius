export enum ProductStatuses {
  Available = "Disponível",
  Unavailable = "Indisponível",
  Inactive = "Desativado",
}

const values = Object.values(ProductStatuses);

export type ProductStatus = (typeof values)[number];
