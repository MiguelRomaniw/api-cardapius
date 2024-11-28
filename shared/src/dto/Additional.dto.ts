import { Additional } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";

export class AdditionalDTO extends BaseDTO {
  id: string | null = null;
  // companyId: string | null = null;
  name: string | null = null;
  description: string | null = null;
  price: number | null = null;
  // company: CompanyDTO[] = [];

  /**
   *
   */
  constructor(entity: Additional) {
    super();

    Object.assign(this, entity);
  }

  public static from(additional: Additional | Additional[]) {
    return super._from(additional, AdditionalDTO, {
      // company: CompanyDTO,
    });
  }
}
