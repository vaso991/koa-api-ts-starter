import Router from 'koa-router';
import { HealthRouter } from './modules/health/health.router';
import { RouterSwagger } from './utils/router.swagger';
import { AuthRouter } from '@App/modules/auth/auth.router';
import KoaRatelimit from 'koa-ratelimit';
import { redisClient } from './utils/redis.client';
import { CrudRouter } from './modules/crud/crud.router';

const router = new Router();
const apiRouter = new Router();

apiRouter.use(
  KoaRatelimit({
    driver: 'redis',
    db: redisClient,
    duration: 60 * 1000,
    max: 100,
    throw: true,
  }),
);
apiRouter.use(AuthRouter.middleware());
apiRouter.use(CrudRouter.middleware());

router.use(HealthRouter.middleware());
router.get('/docs', RouterSwagger(apiRouter));

export { router as AppRoutes, apiRouter as ApiRoutes };
