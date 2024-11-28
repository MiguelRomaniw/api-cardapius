import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";

export class MasterCompanyController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    const count = await this.companyRepository.count();

    return response.status(200).json({ count });
  }

  private static async _store(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = MasterCompanyController._index.bind(MasterCompanyController);
  public static show = MasterCompanyController._show.bind(MasterCompanyController);
  public static store = MasterCompanyController._store.bind(MasterCompanyController);
  public static update = MasterCompanyController._update.bind(MasterCompanyController);
  public static destroy = MasterCompanyController._destroy.bind(MasterCompanyController);
}
