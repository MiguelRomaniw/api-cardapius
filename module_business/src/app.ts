import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./routes";
import { express_async_errors_middleware } from "./middleware/express_async_errors_middleware";

let instance: express.Application;

export class App {
  /**
   *
   */
  constructor() {
    if (!instance) {
      const app = express();
      const port = +process.env.APP_PORT!;

      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(
        bodyParser.json({
          // limit: "10mb",
        })
      );
      app.use(
        cors({
          origin: "*",
        })
      );
      app.set("view engine", "ejs");
      app.set("views", process.env.VIEWS_DIR!);
      app.use(router);
      app.use(express_async_errors_middleware);

      app.listen(port, () => {
        console.log(`App running on ${process.env.APP_URL}`);
      });

      instance = app;
    }
  }

  public getInstance() {
    return instance;
  }
}

export const app = new App();
