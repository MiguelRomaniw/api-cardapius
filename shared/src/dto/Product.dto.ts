import { Company, Product } from "Src/database/entities";
import { ProductStatus } from "Src/types/ProductStatus";
import { AdditionalGroupDTO } from "./AdditionalGroup.dto";
import { BaseDTO } from "./Base.dto";
import { CategoryDTO } from "./Category.dto";
import { ProductImageDTO } from "./ProductImage.dto";

export class ProductDTO
  extends BaseDTO
  implements Omit<Product, "companyId" | "images" | "categories" | "additionalGroups" | "company" | "createdAt" | "updatedAt">
{
  id!: string;
  type!: string;
  // companyId: string | null = null;
  name!: string;
  description!: string;
  price!: number;
  status!: ProductStatus;
  // company!: Company = undefined;
  images?: ProductImageDTO[] = undefined;
  categories?: CategoryDTO[] = undefined;
  additionalGroups?: AdditionalGroupDTO[] = undefined;

  /**
   *
   */
  constructor(entity: Product) {
    super();

    Object.assign(this, entity);
  }

  public static from(product: Product | Product[]) {
    return super._from(product, ProductDTO, { images: ProductImageDTO, categories: CategoryDTO, additionalGroups: AdditionalGroupDTO });
  }
}
