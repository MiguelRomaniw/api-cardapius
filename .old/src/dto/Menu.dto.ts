import { Menu } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { ProductGroupDTO } from "./ProductGroup.dto";

export class MenuDTO extends BaseDTO {
  id: string | null = null;
  // companyId: string | null = null;
  title: string | null = null;
  type: string | null = null;
  productGroups: ProductGroupDTO[] = [];

  public static from(menu: Menu | Menu[]) {
    return super._from(menu, MenuDTO, { productGroups: ProductGroupDTO });
  }
}
