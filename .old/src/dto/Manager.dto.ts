import { Manager } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { CompanyDTO } from "./Company.dto";

export class ManagerDTO extends BaseDTO {
  id: string | null = null;
  cpf: string | null = null;
  email: string | null = null;
  emailConfirmed: string | null = null;
  phoneNumber: string | null = null;
  // password: string | null = null;
  company: CompanyDTO | null = null;

  public static from(manager: Manager | Manager[]) {
    return super._from(manager, ManagerDTO, {
      company: CompanyDTO,
    });
  }
}
