import Router from 'koa-router';
import { CrudController } from './crud.controller';
import { ZodValidator } from 'koa-router-zod-swagger';
import { CrudSchema } from './curd.schema';
import { z } from 'zod';

const router = new Router({
  prefix: '/crud',
});

router.post(
  '/',
  ZodValidator({
    body: CrudSchema,
  }),
  CrudController.Create,
);

router.get('/', CrudController.GetAll);

router.get(
  '/:id',
  ZodValidator({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  CrudController.GetOneById,
);

router.put(
  '/:id',
  ZodValidator({
    body: CrudSchema,
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  CrudController.Update,
);

router.delete(
  '/:id',
  ZodValidator({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  CrudController.Delete,
);

export { router as CrudRouter };
