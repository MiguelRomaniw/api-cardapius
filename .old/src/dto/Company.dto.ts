import { Company } from "Src/database/entities";
import { CompanySchedule } from "Src/types/CompanySchedule";
import { BaseDTO } from "./Base.dto";
import { CompanyLogoDTO } from "./CompanyLogo.dto";
import { ManagerDTO } from "./Manager.dto";
import { MenuDTO } from "./Menu.dto";

export class CompanyDTO extends BaseDTO implements Omit<Company, "owner" | "logo" | "menus"> {
  id!: string;
  managerId!: string;
  name!: string;
  subdomain!: string;
  showDescription!: boolean;
  description!: string;
  contactEmail!: string;
  contactNumber!: string;
  hasDelivery!: boolean;
  hasPickUp!: boolean;
  websiteUrl!: string;
  zipCode!: string;
  street!: string;
  number!: string;
  county!: string;
  city!: string;
  state!: string;
  businessHours!: CompanySchedule[];
  owner?: ManagerDTO;
  logo?: CompanyLogoDTO | undefined;
  menus?: MenuDTO[] | undefined = undefined;

  /**
   *
   */
  constructor(entity: Company) {
    super();

    Object.assign(this, entity);
  }

  public static from(company: Company | Company[]) {
    return super._from(company, CompanyDTO, {
      owner: ManagerDTO,
      logo: CompanyLogoDTO,
      menus: MenuDTO,
    });
  }
}
