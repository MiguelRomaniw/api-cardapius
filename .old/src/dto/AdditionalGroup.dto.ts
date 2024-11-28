import { AdditionalGroup } from "Src/database/entities";
import { AdditionalDTO } from "./Additional.dto";
import { BaseDTO } from "./Base.dto";

export class AdditionalGroupDTO extends BaseDTO {
  id: string | null = null;
  // companyId: string | null = null;
  productId: string | null = null;
  name: string | null = null;
  minLimit: number | null = null;
  maxLimit: number | null = null;
  required: boolean | null = null;
  additionals: AdditionalDTO[] = [];

  public static from(additionalGroup: AdditionalGroup | AdditionalGroup[]) {
    return super._from(additionalGroup, AdditionalGroupDTO, {
      additionals: AdditionalDTO,
    });
  }
}
