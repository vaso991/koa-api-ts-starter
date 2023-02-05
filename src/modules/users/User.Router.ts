import Router from 'koa-router';
import { ZodValidator } from 'koa-router-zod-swagger';
import { UserController } from './User.Controller';
import { UserIdSchema, UserSchema, UserUpdateSchema } from './User.Schema';

const router = new Router({
  prefix: '/users',
});

router.get('/', ZodValidator({
  summary: 'Get users list'
}), UserController.getAllUsers);

router.get(
  '/:id',
  ZodValidator({
    summary: 'Get user by id',
    params: UserIdSchema,
  }),
  UserController.getUserById,
);

router.post(
  '/',
  ZodValidator({
    summary: 'Add new user',
    body: UserSchema,
  }),
  UserController.addNewUser,
);

router.patch(
  '/:id',
  ZodValidator({
    summary: 'Update user by id',
    body: UserUpdateSchema,
    params: UserIdSchema,
  }),
  UserController.updateUser,
);

router.delete(
  '/:id',
  ZodValidator({
    summary: 'Delete user by id',
    params: UserIdSchema,
  }),
  UserController.deleteUser,
);

export { router as UserRouter };
