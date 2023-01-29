import Router from 'koa-router';
import { ZodValidator } from 'koa-router-zod-swagger';
import { UserController } from './User.Controller';
import { UserIdSchema, UserSchema, UserUpdateSchema } from './User.Schema';

const router = new Router({
  prefix: '/users',
});

router.get('/', UserController.getAllUsers);

router.get(
  '/:id',
  ZodValidator({
    params: UserIdSchema,
  }),
  UserController.getUserById,
);

router.post(
  '/',
  ZodValidator({
    body: UserSchema,
  }),
  UserController.addNewUser,
);

router.patch(
  '/:id',
  ZodValidator({
    body: UserUpdateSchema,
    params: UserIdSchema,
  }),
  UserController.updateUser,
);

router.delete(
  '/:id',
  ZodValidator({
    params: UserIdSchema,
  }),
  UserController.deleteUser,
);

export { router as UserRouter };
