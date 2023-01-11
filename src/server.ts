import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import dotenv from 'dotenv-flow';
import { AppRoutes } from './routes';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';

dotenv.config();

async function run() {
  // await initializeDb();
  const app = new Koa();
  
  app.keys = [process.env.COOKIE_KEY || 'secret'];
  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(bodyParser());
  LoggerMiddleware(app);
  app.use(ErrorMiddleware());
  app.use(AppRoutes.allowedMethods()).use(AppRoutes.middleware());
  app.use((ctx) => ctx.throw(404));

  const PORT = process.env.PORT;
  app.listen(PORT);
  console.log(`Server started on port http://localhost:${PORT}`);
}
run();