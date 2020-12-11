import { config } from "../deps.js";

const env = config();
let dataConfig = {};

dataConfig.database = {
    hostname: env.hostname,
    database: env.database,
    user: env.user,
    password: env.password,
    port: Number(env.port)
};

dataConfig.port = 7777
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  dataConfig.port = Number(lastArgument);
}

export { dataConfig }; 
