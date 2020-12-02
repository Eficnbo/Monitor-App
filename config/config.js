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

export { config }; 
