import { AuthService } from './auth.service';
import type {
  AuthRegisterType,
  RefreshTokenType,
} from '@App/modules/auth/auth.schema';
import { RouterContext } from 'koa-router';
import { Next } from 'koa';
import { AppContext } from '@App/utils/app.context';
import { UserModelType } from '@App/db/models/user.model';
import { pick } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  /**
   * Authenticate user using username and password.
   * After authentication pass to jwt generator.
   */
  public static async authLocal(ctx: AppContext<AuthRegisterType>, next: Next) {
    const { email, password } = ctx.request.body as AuthRegisterType;
    try {
      const user = await AuthService.authenticate(email, password);
      if (!user) ctx.throw(StatusCodes.UNAUTHORIZED);
      ctx.state.user = user;
      return next();
    } catch (error) {
      ctx.throw(StatusCodes.UNAUTHORIZED);
    }
  }

  /**
   * Generate access and refresh token for user.
   */
  public static async generateToken(ctx: AppContext) {
    const user = ctx.state.user as UserModelType;
    const { accessToken, refreshToken } = await AuthService.generateToken(user);
    if (ctx.state.user.jwt) {
      await AuthService.revokeRefreshToken(ctx.state.user.jwt);
    }
    ctx.body = {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Revoke refresh token from redis.
   * After revoke user can not receive new access token for this refresh token.
   */
  public static async revokeRefreshToken(ctx: AppContext) {
    const { refreshToken } = ctx.request.body as RefreshTokenType;
    await AuthService.revokeRefreshToken(refreshToken);
    ctx.body = {
      success: true,
    };
  }

  /**
   * Register new user using username and password.
   */
  public static async registerLocal(ctx: RouterContext) {
    const user = ctx.request.body as AuthRegisterType;
    const newUser = await AuthService.registerUser(user);
    if (!newUser) {
      ctx.throw(StatusCodes.CONFLICT);
    }
    ctx.body = {
      id: newUser.id,
      email: newUser.email,
    };
  }

  /**
   * Return authorized user's information
   */
  public static getMe(ctx: AppContext) {
    ctx.body = pick(ctx.state.user, 'email', 'id');
  }
}
