import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { AppRoutes } from './Routes';
import { LoggerMiddleware } from './middlewares/Logger.Middleware';
import { ErrorMiddleware } from './middlewares/Error.Middleware';
import { Db } from './db';
import { AppEnv } from './App.Env';

class Server {
  private app: Koa;
  constructor() {
    this.app = new Koa();
  }

  public static async init() {
    const server = new Server();
    await Db.init();
    server.initializeMiddlewares();
    server.initializeRoutes();
    server.start();
  }

  private initializeMiddlewares() {
    this.app.keys = [AppEnv.COOKIE_KEY];
    this.app.use(
      cors({
        credentials: true,
      }),
    );
    this.app.use(bodyParser());
    this.app.use(ErrorMiddleware());
    this.app.use(LoggerMiddleware());
  }

  private initializeRoutes() {
    this.app.use(AppRoutes.allowedMethods()).use(AppRoutes.middleware());
    this.app.use((ctx) => ctx.throw(404));
  }

  private start() {
    return this.app.listen(AppEnv.PORT, () => {
      console.log(`Server started on port http://localhost:${AppEnv.PORT}`);
    });
  }
}

void Server.init();
