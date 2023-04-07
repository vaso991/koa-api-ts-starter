import Router from 'koa-router';
import { HelloWorldRouter } from './modules/helloworld/HelloWorld.Router';
import { UserRouter } from './modules/users/User.Router';
import { HealthRouter } from './modules/health/Health.Router';
import { RouterSwagger } from './utils/RouterSwagger';

const router = new Router();
const apiRouter = new Router();

apiRouter.use(HelloWorldRouter.middleware());
apiRouter.use(UserRouter.middleware());

router.use(HealthRouter.middleware());
router.get('/docs', RouterSwagger(apiRouter));

export { router as AppRoutes, apiRouter as ApiRoutes };
