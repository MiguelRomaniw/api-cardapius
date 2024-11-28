import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";

/**
 * @todo fetch all plans
 * @todo fetch one plan
 * @todo create plan
 * @todo update plan
 */

export class MasterPlanController extends AppContext {
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

  public static index = MasterPlanController._index.bind(MasterPlanController);
  public static show = MasterPlanController._show.bind(MasterPlanController);
  public static store = MasterPlanController._store.bind(MasterPlanController);
  public static update = MasterPlanController._update.bind(MasterPlanController);
  public static destroy = MasterPlanController._destroy.bind(MasterPlanController);
}
