import Router from 'koa-router';
import { ValidatorMiddleware } from '../../middlewares/Validator.Middleware';
import { UserController } from './User.Controller';
import { UserIdSchema, UserSchema, UserUpdateSchema } from './User.Schema';

const router = new Router({
  prefix: '/users',
});

router.get('/', UserController.getAllUsers);

router.get(
  '/:id',
  ValidatorMiddleware({
    params: UserIdSchema,
  }),
  UserController.getUserById,
);

router.post(
  '/',
  ValidatorMiddleware({
    body: UserSchema,
  }),
  UserController.addNewUser,
);

router.patch(
  '/:id',
  ValidatorMiddleware({
    body: UserUpdateSchema,
    params: UserIdSchema,
  }),
  UserController.updateUser,
);

router.delete(
  '/:id',
  ValidatorMiddleware({
    params: UserIdSchema,
  }),
  UserController.deleteUser,
);

export { router as UserRouter };
