import { CompanyLogo } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { FileDTO } from "./File.dto";

export class CompanyLogoDTO extends BaseDTO implements Pick<CompanyLogo, "id" | "url"> {
  id!: string;
  url!: string;
  // file?: FileDTO;
  // companyId: string | null = null;
  // fileId: string | null = null;

  /**
   *
   */
  constructor(entity: CompanyLogo) {
    super();

    this.id = entity.id;
    this.url = entity.url;

    // Object.assign(this, entity);
  }

  public static from(companyLogo: CompanyLogo | CompanyLogo[]) {
    return super._from(companyLogo, CompanyLogoDTO, {
      file: FileDTO,
    });
  }
}
