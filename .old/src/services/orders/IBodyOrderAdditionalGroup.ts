import { AdditionalGroup } from "Src/database/entities";
import { IBodyOrderAdditionalGroupAdditional } from "./IBodyOrderAdditionalGroupAdditional";

export interface IOrderAdditionalGroup {
  additionalGroup: AdditionalGroup;
  additionals: IBodyOrderAdditionalGroupAdditional[];
}
