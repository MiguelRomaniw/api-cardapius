import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";

export class UploadsController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static async _show(request: Request, response: Response) {
    // TODO: remake upload route

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

  public static index = UploadsController._index.bind(UploadsController);
  public static show = UploadsController._show.bind(UploadsController);
  public static store = UploadsController._store.bind(UploadsController);
  public static update = UploadsController._update.bind(UploadsController);
  public static destroy = UploadsController._destroy.bind(UploadsController);
}
