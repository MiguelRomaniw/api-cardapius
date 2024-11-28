export enum FileTypes {
  CompanyLogo = "company-logo",
  ProductImage = "product-image",
}

const values = Object.values(FileTypes);

export type FileType = (typeof values)[number];
