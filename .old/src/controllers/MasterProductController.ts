import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";

/**
 *
 */

export class MasterProductController extends AppContext {
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

  public static index = MasterProductController._index.bind(MasterProductController);
  public static show = MasterProductController._show.bind(MasterProductController);
  public static store = MasterProductController._store.bind(MasterProductController);
  public static update = MasterProductController._update.bind(MasterProductController);
  public static destroy = MasterProductController._destroy.bind(MasterProductController);
}
