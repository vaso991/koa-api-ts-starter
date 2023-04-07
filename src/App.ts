import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { AppRoutes, ApiRoutes } from './Routes';
import { LoggerMiddleware } from './middlewares/Logger.Middleware';
import { ErrorMiddleware } from './middlewares/Error.Middleware';
import { Db } from './db';
import { AppEnv } from './App.Env';

export class App {
  private koaApp: Koa;

  constructor() {
    this.koaApp = new Koa();
  }

  public getKoaApp() {
    return this.koaApp;
  }

  public static async init() {
    const app = new App();
    await Db.init();
    app.initializeMiddlewares();
    app.initializeRoutes();
    app.initializeProcessExitLiteners();
    return app;
  }

  private initializeMiddlewares() {
    this.koaApp.keys = [AppEnv.COOKIE_KEY];
    this.koaApp.use(
      cors({
        credentials: true,
      }),
    );
    this.koaApp.use(bodyParser());
    this.koaApp.use(ErrorMiddleware());
    this.koaApp.use(LoggerMiddleware());
  }

  private initializeRoutes() {
    this.koaApp.use(AppRoutes.allowedMethods()).use(AppRoutes.middleware());
    this.koaApp.use(ApiRoutes.allowedMethods()).use(ApiRoutes.middleware());
    this.koaApp.use((ctx) => ctx.throw(404));
  }

  public exit() {
    console.log('Closing...');
    this.closeDbConnection();
    process.exit(1);
  }

  public closeDbConnection() {
    void Db.destroy();
  }

  private initializeProcessExitLiteners() {
    process.on('SIGINT', this.exit.bind(this));
    process.on('SIGTERM', this.exit.bind(this));
  }

  public start() {
    return this.koaApp.listen(AppEnv.PORT, () => {
      console.log(`Server started on port http://localhost:${AppEnv.PORT}`);
      console.log(`Docs started on port http://localhost:${AppEnv.PORT}/docs`);
    });
  }
}
