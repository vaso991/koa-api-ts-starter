import Router from 'koa-router';
import { z } from 'zod';
import { ValidatorMiddleware } from './middlewares/validate.middleware';

const router = new Router();

router.get('/health', async (ctx) => {
  ctx.body = {
    status: 'healthy',
  };
});

const testSchema = z.object({
  hello: z.string().min(4)
});
// type testType = z.infer<typeof testSchema>;
router.post('/test', 
ValidatorMiddleware({
  body: testSchema
}), (ctx) => ctx.body = ctx.request.body);

export { router as AppRoutes };