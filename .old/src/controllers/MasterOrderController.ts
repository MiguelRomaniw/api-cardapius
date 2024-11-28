import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";

/**
 *
 */

export class MasterOrderController extends AppContext {
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

  public static index = MasterOrderController._index.bind(MasterOrderController);
  public static show = MasterOrderController._show.bind(MasterOrderController);
  public static store = MasterOrderController._store.bind(MasterOrderController);
  public static update = MasterOrderController._update.bind(MasterOrderController);
  public static destroy = MasterOrderController._destroy.bind(MasterOrderController);
}
