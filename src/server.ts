import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import dotenv from 'dotenv-flow';
import { AppRoutes } from './routes';
import { LoggerMiddleware } from './middlewares/Logger.Middleware';
import { ErrorMiddleware } from './middlewares/Error.Middleware';
import { Db } from './db';

dotenv.config();

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
    this.app.keys = [process.env.COOKIE_KEY || 'secret'];
    this.app.use(
      cors({
        credentials: true,
      })
    );
    this.app.use(bodyParser());
    LoggerMiddleware(this.app);
    this.app.use(ErrorMiddleware());
  }

  private initializeRoutes() {
    this.app.use(AppRoutes.allowedMethods()).use(AppRoutes.middleware());
    this.app.use((ctx) => ctx.throw(404));
  }

  private start() {
    const PORT = process.env.PORT;
    return this.app.listen(PORT, () => {
      console.log(`Server started on port http://localhost:${PORT}`);
    })
  }
}

Server.init();