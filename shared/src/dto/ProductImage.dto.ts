import { ProductImage } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { FileDTO } from "./File.dto";

export class ProductImageDTO extends BaseDTO implements Pick<ProductImage, "id" | "url"> {
  id!: string;
  url!: string;
  // file: FileDTO | null = null;
  // companyId: string | null = null;
  // fileId: string | null = null;

  /**
   *
   */
  constructor(entity: ProductImage) {
    super();

    this.id = entity.id;
    this.url = entity.url;
  }

  public static from(productImage: ProductImage | ProductImage[]) {
    return super._from(productImage, ProductImageDTO, {
      file: FileDTO,
    });
  }
}
