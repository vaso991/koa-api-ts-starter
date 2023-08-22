import Router from 'koa-router';
import { AuthController } from './auth.controller';
import { ZodValidator } from 'koa-router-zod-swagger';
import {
  AuthLoginSchema,
  AuthRegisterSchema,
  RefreshTokenSchema,
} from '@App/modules/auth/auth.schema';
import {
  AuthMiddleware,
  RefreshTokenMiddleware,
} from '@App/modules/auth/auth.middleware';

const router = new Router({
  prefix: '/auth',
});

router.post(
  '/login',
  ZodValidator({
    summary: 'Login using username and password',
    body: AuthLoginSchema,
  }),
  AuthController.authLocal,
  AuthController.generateToken,
);

router.post(
  '/register',
  ZodValidator({
    summary: 'Register new user',
    body: AuthRegisterSchema,
  }),
  AuthController.registerLocal,
);

router.get(
  '/me',
  AuthMiddleware,
  ZodValidator({
    summary: 'Get authorized user information',
  }),
  AuthController.getMe,
);

router.post(
  '/refresh',
  ZodValidator({
    summary: 'Get new access and refresh token after accesstoken is expired',
    body: RefreshTokenSchema,
  }),
  RefreshTokenMiddleware,
  AuthController.generateToken,
);

router.post(
  '/revoke',
  ZodValidator({
    summary: 'Revoke refresh token',
    body: RefreshTokenSchema,
  }),
  AuthController.revokeRefreshToken,
);

export { router as AuthRouter };
