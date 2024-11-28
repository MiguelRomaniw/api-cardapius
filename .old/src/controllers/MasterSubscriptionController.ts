import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";

/**
 * @todo fetch all subscriptions
 * @todo fetch one subscription
 * @todo create subscription for manager
 * @todo update manager subscription
 * @todo delete manager subscription
 */

export class MasterSubscriptionController extends AppContext {
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

  public static index = MasterSubscriptionController._index.bind(MasterSubscriptionController);
  public static show = MasterSubscriptionController._show.bind(MasterSubscriptionController);
  public static store = MasterSubscriptionController._store.bind(MasterSubscriptionController);
  public static update = MasterSubscriptionController._update.bind(MasterSubscriptionController);
  public static destroy = MasterSubscriptionController._destroy.bind(MasterSubscriptionController);
}
