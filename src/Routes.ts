import { StatusCodes } from 'http-status-codes';
import Router from 'koa-router';
import { KoaRouterSwagger } from 'koa-router-zod-swagger';
import { Db } from './db';
import { HelloWorldRouter } from './modules/helloworld/HelloWorld.Router';
import { UserRouter } from './modules/users/User.Router';

const router = new Router();

router.get('/health', async (ctx) => {
  const knex = await Db.get();
  try {
    await knex.raw('select 1+1 as result');
    ctx.status = StatusCodes.OK;
    ctx.body = {
      status: 1,
    };
  } catch (error) {
    ctx.status = StatusCodes.SERVICE_UNAVAILABLE;
    ctx.body = {
      status: 0,
    };
  }
});

router.use(HelloWorldRouter.middleware());
router.use(UserRouter.middleware());

router.get(
  '/docs',
  KoaRouterSwagger(router, {
    routePrefix: false,
    title: 'Test Api',
    swaggerOptions: {
      spec: {
        info: {
          version: '1.0.0',
          description: 'This is test api specs',
        },
      },
    },
  }),
);

export { router as AppRoutes };
