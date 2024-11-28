import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";

/**
 *
 */

export class MasterCustomerController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
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

  public static index = MasterCustomerController._index.bind(MasterCustomerController);
  public static show = MasterCustomerController._show.bind(MasterCustomerController);
  public static store = MasterCustomerController._store.bind(MasterCustomerController);
  public static update = MasterCustomerController._update.bind(MasterCustomerController);
  public static destroy = MasterCustomerController._destroy.bind(MasterCustomerController);
}
