import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

{
  const node_env =
    process.argv.reduce((path: string | null, argument: string) => {
      if (argument.startsWith("--env=")) {
        return argument.split("--env=")[1];
      }

      return path;
    }, "") || "development";

  dotenvExpand.expand(dotenv.config());

  process.env.NODE_ENV = node_env;
}
