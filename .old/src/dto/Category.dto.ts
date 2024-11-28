import { Category } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { ProductDTO } from "./Product.dto";

export class CategoryDTO extends BaseDTO {
  id: string | null = null;
  companyId: string | null = null;
  name: string | null = null;
  products: ProductDTO[] = [];

  public static from(category: Category | Category[]) {
    return super._from(category, CategoryDTO, {
      products: ProductDTO,
    });
  }
}
