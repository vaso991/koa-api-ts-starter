import { Context, Next } from 'koa';
import { RouterContext } from 'koa-router';
import PinoHttp, { Options as PinoOptions } from 'pino-http';
import { IncomingMessage, ServerResponse } from 'http';
import { format } from 'date-fns';
import { AppEnv } from '../App.Env';

const PINO_OPTIONS: PinoOptions = {
  timestamp: () =>
    `,"time":"${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}"`,
  autoLogging: {
    ignore(req: IncomingMessage) {
      return (
        ['/api/health'].includes(req.url || '') ||
        req.headers.accept !== 'application/json'
      );
    },
  },
  wrapSerializers: false,
  serializers: {
    req: ReqSerializer,
    res: ResSerializer,
  },
  transport:
    AppEnv.NODE_ENV !== 'development'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
};

export const LoggerMiddleware = (options?: PinoOptions) => {
  const pino = PinoHttp({ ...PINO_OPTIONS, ...options });
  const Logger = (ctx: Context, next: Next) => {
    // @ts-ignore
    ctx.req.ctx = ctx;
    pino(ctx.req, ctx.res);
    return next()
      .then(() => {
        // @ts-ignore
        ctx.res.body = ctx.response.body;
      })
      .catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ctx.res.err = error;
        throw error;
      });
  };
  return Logger;
};
function ReqSerializer(req: IncomingMessage & { ctx: RouterContext }) {
  const _req: { [key: string]: any } = {};
  _req.id = req.id;
  _req.method = req.method;
  _req.url = req.url;
  _req.path = req.ctx.path;
  _req.query = req.ctx.query;
  _req.body = req.ctx.request.body;
  _req.remoteAddress = req.ctx.ip;
  // _req.headers = req.ctx.headers;
  return _req;
}

function ResSerializer(res: ServerResponse<IncomingMessage>) {
  const _res: { [key: string]: any } = {};
  _res.statusCode = res.statusCode;
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  _res.body = res.body;
  // _res.headers = res.getHeaders();
  return _res;
}
