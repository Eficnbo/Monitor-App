let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "cbccxwqx",
    user: "cbccxwqx",
    password: "GUkQaUNWWIlmt4uEcMt_EAfc663DOJup",
    port: 5432
  };
}
config.port = 7777
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  config.port = Number(lastArgument);
}

export { config }; 
