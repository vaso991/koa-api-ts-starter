import { AppContext, AppState } from '@App/utils/app.context';
import { Next } from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppEnv } from '@App/app.env';
import { RefreshTokenType } from '@App/modules/auth/auth.schema';
import { redisClient } from '@App/utils/redis.client';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware for validating authorization header bearer token.
 * If token is not provided, incorrect, or expired, request is failed with 401 status code with 'ACCESS_TOKEN_INVALID' message.
 * If token is valid, processed to next middleware/controller.
 * ctx.state.user contains decoded token. `jwt` param contains access token.
 * @see `AuthService.generateToken`
 */
export const AuthMiddleware = (ctx: AppContext, next: Next) => {
  try {
    const authHeader = ctx.header.authorization;
    if (!authHeader) {
      ctx.throw('ACCESS_TOKEN_INVALID', StatusCodes.UNAUTHORIZED);
    }
    const [, token] = authHeader?.split(' ');
    const decoded = jwt.verify(token, AppEnv.ACCESS_TOKEN_SECRET) as JwtPayload;
    ctx.state.user = {
      ...decoded,
      jwt: token,
    } as AppState['user'];
    return next();
  } catch (error) {
    ctx.throw('ACCESS_TOKEN_INVALID', StatusCodes.UNAUTHORIZED);
  }
};

/**
 * Middleware for validating refresh token from request body.
 * If token is not provided, incorrect, or expired, request is failed with 401 status code with 'REFRESH_TOKEN_INVALID' message.
 * If token is valid, processed to next middleware/controller.
 * ctx.state.user contains decoded token. `jwt` param contains refresh token.
 * @see `AuthService.generateToken`
 */
export const RefreshTokenMiddleware = async (ctx: AppContext, next: Next) => {
  const { refreshToken } = ctx.request.body as RefreshTokenType;
  if (!refreshToken) {
    ctx.throw('REFRESH_TOKEN_INVALID', StatusCodes.UNAUTHORIZED);
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      AppEnv.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;
    const refreshTokenAllowed = await redisClient.get(refreshToken);
    if (!refreshTokenAllowed) {
      ctx.throw('REFRESH_TOKEN_INVALID', StatusCodes.UNAUTHORIZED);
    }
    ctx.state.user = {
      ...decoded,
      jwt: refreshToken,
    } as AppState['user'];
    return next();
  } catch (error) {
    ctx.throw('REFRESH_TOKEN_INVALID', StatusCodes.UNAUTHORIZED);
  }
};
