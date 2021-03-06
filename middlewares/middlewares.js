import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request,session }, next) => {
  let id = (await session.get('user'))
  if(!id) {
    id = "Anonymous"
  }
  else {
    id = id.id
  }
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`Time: ${start} Method: ${request.method} ${request.url.pathname} user: ${id} - ${ms} ms`);
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const limitAccessMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/behavior')) {
    if (await context.session.get('authenticated')) {
      await next();
    } else {
      context.response.status = 401;
      context.render('error.ejs')
    }
  } else {
    await next();
  }
}


export { limitAccessMiddleware, errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware };

