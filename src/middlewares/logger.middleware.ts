import Koa from 'koa';
import Logger from 'koa-pino-logger';
import { format } from 'date-fns';

export const LoggerMiddleware = (app: Koa) => {
  let transport;
  if (!process.env.NODE_ENV) {
    transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    };
  }
  app.use(async (context, next) => {
    if (context.request.body) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context.req.body = context.request.body;
    }
    return next();
  });

  app.use(
    Logger({
      timestamp: () =>
        `,"time":"${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}"`,
      serializers: {
        req(req) {
          if (req.raw && req.raw.body) {
            req.body = req.raw.body;
          }
          delete req.headers;
          return req;
        },
        res(res) {
          if (res.raw && res.raw.body) {
            res.body = res.raw.body;
          }
          delete res.headers;
          return res;
        },
      },
      autoLogging: {
        ignore(req) {
          return !!req.url && ['/api/health'].includes(req.url.toString());
        },
      },
      transport,
    }),
  );

  app.use(async (context, next) =>
    next().then(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context.res.body = context.body;
    }),
  );
};
