import 'reflect-metadata'; // Reimported for jest
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import { AppRoutes, ApiRoutes } from './routes';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { Db } from './db';
import { AppEnv } from '@App/app.env';
import { StatusCodes } from 'http-status-codes';
import { redisClient } from './utils/redis.client';

export class App {
  private readonly koaApp: Koa;

  constructor() {
    this.koaApp = new Koa();
  }

  public getKoaApp() {
    return this.koaApp;
  }

  /**
   * Initialize application
   * @returns App instance
   */
  public static async init() {
    const app = new App();
    await Db.init();
    app.initializeMiddlewares();
    app.initializeRoutes();
    app.initializeProcessExitLiteners();
    return app;
  }

  // Initialize middlewares
  private initializeMiddlewares() {
    this.koaApp.keys = [AppEnv.COOKIE_KEY];
    this.koaApp.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        dnsPrefetchControl: false,
      }),
    );
    this.koaApp.use(
      cors({
        credentials: true,
      }),
    );
    this.koaApp.use(koaBody());
    this.koaApp.use(ErrorMiddleware());
    this.koaApp.use(LoggerMiddleware());
  }

  /**
   * Initialize routes
   * AppRoutes is not api routes. e.g.: swagger docs serve and healthcheck
   * ApiRoutes contains all api routes defined in modules directory
   */
  private initializeRoutes() {
    this.koaApp.use(AppRoutes.allowedMethods()).use(AppRoutes.middleware());
    this.koaApp.use(ApiRoutes.allowedMethods()).use(ApiRoutes.middleware());
    this.koaApp.use((ctx) => ctx.throw(StatusCodes.NOT_FOUND));
  }

  // Close all active connections
  public exit() {
    console.log('Closing...');
    this.closeDbConnection();
    redisClient.quit();
  }

  // Exit application and force process exit
  private exitWithProcess() {
    this.exit();
    process.exit(1);
  }

  // Close active connection to database
  public closeDbConnection() {
    return Db.destroy();
  }

  // Run database seed. For development and testing purposes.
  public seedDb() {
    return Db.seed();
  }

  // Listen to systemwide process termination signal.
  private initializeProcessExitLiteners() {
    process.on('SIGINT', this.exitWithProcess.bind(this));
    process.on('SIGTERM', this.exitWithProcess.bind(this));
    process.on('SIGQUIT', this.exitWithProcess.bind(this));
  }

  // Start application and bind to port
  public start() {
    return this.koaApp.listen(AppEnv.PORT, () => {
      console.log(`Server started on port http://127.0.0.1:${AppEnv.PORT}`);
      console.log(`Docs started on port http://127.0.0.1:${AppEnv.PORT}/docs`);
    });
  }
}
