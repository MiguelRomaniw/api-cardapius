import { File } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";

export class FileDTO extends BaseDTO {
  id: string | null = null;
  // fileName: string | null = null;
  // type: string | null = null;
  url: string | null = null;
  // companyLogo: string | null = null;

  public static from(file: File | File[]) {
    return super._from(file, FileDTO, {});
  }
}
