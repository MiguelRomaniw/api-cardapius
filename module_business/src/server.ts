import "express-async-errors";
import "startup";
import { App } from "./app";
import { dataSource } from "Shared/database/app-data-source";

(async () => {
  try {
    await dataSource.initialize();

    new App();

    process.env.STARTED_AT = Date.now().toString();
  } catch (error) {
    console.log(error);
  }
})();
