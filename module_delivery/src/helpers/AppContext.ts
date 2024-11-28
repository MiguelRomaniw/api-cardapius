import { dataSource } from "Src/database/data-source";
import { User } from "Src/database/entities";

export class AppContext {
  protected static readonly userRepository = dataSource.getRepository(User);
}
