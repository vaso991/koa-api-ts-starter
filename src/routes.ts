import Router from 'koa-router';
import { z } from 'zod';
import { ValidatorMiddleware } from './middlewares/Validator.Middleware';
import { HelloWorldRouter } from './modules/helloworld/HelloWorld.Router';
import { UserRouter } from './modules/users/User.Router';

const router = new Router();

router.get('/health', async (ctx) => {
  ctx.body = {
    status: 'healthy',
  };
});

router.use(HelloWorldRouter.middleware());
router.use(UserRouter.middleware());

export { router as AppRoutes };