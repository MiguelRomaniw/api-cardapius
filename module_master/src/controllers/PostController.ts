import { AppContext } from "Src/helpers/AppContext";
import { Request, Response } from "express";

export class PostController extends AppContext {
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

  public static index = PostController._index.bind(AppContext);
  public static show = PostController._show.bind(AppContext);
  public static store = PostController._store.bind(AppContext);
  public static update = PostController._update.bind(AppContext);
  public static destroy = PostController._destroy.bind(AppContext);
}
