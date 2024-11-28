import { ProductGroup } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { ProductDTO } from "./Product.dto";

export class ProductGroupDTO extends BaseDTO {
  id: string | null = null;
  // menuId: string | null = null;
  // companyId: string | null = null;
  name: string | null = null;
  products: ProductDTO[] = [];

  public static from(productGroup: ProductGroup | ProductGroup[]) {
    return super._from(productGroup, ProductGroupDTO, { products: ProductDTO });
  }
}
