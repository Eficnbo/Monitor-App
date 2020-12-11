import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';
import { Session,viewEngine, engineFactory, adapterFactory,bcrypt } from "./deps.js";
import { dataConfig } from "./config/config.js";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

app.use(middleware.limitAccessMiddleware);
app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);

app.use(router.routes());
if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: dataConfig.port });
}

export { app };
