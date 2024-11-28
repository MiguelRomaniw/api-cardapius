import "startup";
import { App } from "./app";
import { dataSource } from "./database/app-data-source";

dataSource
  .initialize()
  .then(() => {
    new App();
  })
  .catch((error) => {
    console.log(error);

    process.exit(0);
  });
