import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { express_async_errors_middleware } from "./middleware/express_async_errors_middleware";
import { router } from "./routes";

let instance: express.Application;

export class App {
  constructor() {
    if (!instance) {
      const app = express();
      const port = +process.env.APP_PORT!;

      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(express.json());
      app.use(
        cors({
          origin: "*",
        })
      );
      app.use(router);
      app.use(express_async_errors_middleware);

      app.listen(port, () => {
        console.log("Express is up!");
      });

      instance = app;
    }
  }

  public getInstance() {
    return instance;
  }
}
