import dotenvExpand from "dotenv-expand";
import dotenv from "dotenv";

dotenvExpand.expand(dotenv.config());

{
  const node_env =
    process.argv.reduce((path: string | null, argument: string) => {
      if (argument.startsWith("--env=")) {
        return argument.split("--env=")[1];
      }

      return path;
    }, "") || "development";

  process.env.NODE_ENV = node_env;
}
