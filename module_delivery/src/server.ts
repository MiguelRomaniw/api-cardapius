import "express-async-errors";
import "startup";
import { App } from "./app";
import { dataSource } from "./database/data-source";

(async () => {
  try {
    await dataSource.initialize();

    new App();
  } catch (error) {
    console.log(error);
  }
})();
