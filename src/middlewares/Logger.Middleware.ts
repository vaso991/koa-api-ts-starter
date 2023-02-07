import { Context, Next } from 'koa';
import PinoHttp, { Options as PinoOptions } from 'pino-http';
import { IncomingMessage, ServerResponse } from 'http';
import { format } from 'date-fns';
import { AppEnv } from '../App.Env';

const PINO_OPTIONS: PinoOptions = {
  timestamp: () =>
    `,"time":"${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}"`,
  autoLogging: {
    ignore(req: IncomingMessage) {
      return (['/api/health'].includes(req.url || '') || req.headers.accept !== 'application/json');
    },
  },
  serializers: {
    req(req: IncomingMessage & { raw: any }) {
      const reqClone: { [key: string]: any } = { ...req };
      reqClone.body = req.raw?.body;
      delete reqClone.headers;
      return reqClone;
    },
    res(res: ServerResponse<IncomingMessage> & { raw: any }) {
      const resClone: { [key: string]: any } = { ...res };
      resClone.body = res.raw?.body;
      delete resClone.headers;
      return resClone;
    }
  },
  transport: AppEnv.NODE_ENV !== 'development' ? undefined : {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
};

export const LoggerMiddleware = (options?: PinoOptions) => {
  const pino = PinoHttp({... PINO_OPTIONS, ...options });
  const Logger = (ctx: Context, next: Next) => {
    // @ts-ignore
    ctx.req.body = ctx.request.body;
    pino(ctx.req, ctx.res);
    return next().then(() => {
      // @ts-ignore
      ctx.res.body = ctx.response.body;
    }).catch((error) => {
      ctx.res.err = error;
      throw error;
    });
  };
  return Logger;
};
