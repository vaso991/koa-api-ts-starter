import { UserModel, UserModelType } from '@App/db/models/user.model';
import { AuthUtils } from '@App/modules/auth/auth.utils';
import type { AuthLoginType } from '@App/modules/auth/auth.schema';
import { AppEnv } from '@App/app.env';
import jwt from 'jsonwebtoken';
import { redisClient } from '@App/utils/redis.client';

export class AuthService {
  /**
   * Authenticate user.
   * @param {string} email User email
   * @param {string} password User password
   */
  public static async authenticate(email: string, password: string) {
    const user = await UserModel.query().findOne({ email });
    if (!user) return null;
    const passwordEquals = await AuthUtils.comparePassword(
      password,
      user.password,
    );
    if (!passwordEquals) return null;
    return user;
  }

  /**
   * Generate access and refresh token for user object.
   * Store refresh token in redis based on oauth protocol.
   * @param user User object
   */
  public static async generateToken(user: UserModelType) {
    const encodingUser = {
      id: user.id,
      email: user.email,
    };
    const jwtConfig = {
      issuer: AppEnv.JWT_ISSUER,
    };
    const accessToken = jwt.sign(encodingUser, AppEnv.ACCESS_TOKEN_SECRET, {
      ...jwtConfig,
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(encodingUser, AppEnv.REFRESH_TOKEN_SECRET, {
      ...jwtConfig,
      expiresIn: AppEnv.REFRESH_TOKEN_EXP,
    });
    await redisClient.set(refreshToken, '1', 'EX', AppEnv.REFRESH_TOKEN_EXP);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Revoke refresh token.
   * Token is deleted for redis.
   * After revoke, user cannot receive new access token from same refresh token.
   * @param token User refresh token
   */
  public static async revokeRefreshToken(token: string) {
    await redisClient.del(token);
  }

  /**
   * Register new user.
   * @param user User object
   */
  public static async registerUser(user: AuthLoginType) {
    const existingUser = await UserModel.query().findOne('email', user.email);
    if (existingUser) {
      return null;
    }
    const hashedPassword = await AuthUtils.hashPassword(user.password);
    return UserModel.query().insert({
      email: user.email,
      password: hashedPassword,
    });
  }
}
