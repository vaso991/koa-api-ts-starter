import Router from 'koa-router';
import { HealthController } from './Health.Controller';

const router = new Router({
  prefix: '/health',
});

router.get('/', HealthController.checkHealth);

export { router as HealthRouter };
