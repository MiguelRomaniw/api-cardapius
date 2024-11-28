import { Request, Response } from "express";
import { dataSource } from "Shared/database/app-data-source";
import { AppContext } from "Shared/helpers/AppContext";

export class _HealthController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    return response.status(200).render("health_check", { url: process.env.APP_URL! });
  }

  private static async _store(request: Request, response: Response) {
    const start = Date.now();

    try {
      await dataSource.query("SELECT 1");
      const duration = Date.now() - start;
      const uptime = start - +process.env.STARTED_AT!;

      return response.status(200).json({ status: "ok", duration, uptime });
    } catch (error) {
      const duration = Date.now() - start;

      return response.status(200).json({ status: "error", duration, uptime: 0 });
    }
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = _HealthController._index.bind(AppContext);
  public static show = _HealthController._show.bind(AppContext);
  public static store = _HealthController._store.bind(AppContext);
  public static update = _HealthController._update.bind(AppContext);
  public static destroy = _HealthController._destroy.bind(AppContext);
}
