import { StatusCodes } from 'http-status-codes';
import { RouterContext } from 'koa-router';
import { UniqueViolationError } from 'objection';
import { IUser, IUserOptional } from './User.Schema';
import { UserService } from './User.Service';
export class UserController {
  public static async getAllUsers(ctx: RouterContext) {
    const { query } : { query: IUserOptional } = ctx;
    ctx.body = await UserService.getAllUsers(query);
  }

  public static async getUserById(ctx: RouterContext) {
    const { id } = ctx.params;
    ctx.body = await UserService.getUserById(id);
  }

  public static async addNewUser(ctx: RouterContext) {
    const user: IUser = ctx.request.body as IUser;
    try {
      const newUser = await UserService.addNewUser(user);
      ctx.status = StatusCodes.CREATED;
      ctx.body = newUser;
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        return ctx.throw(StatusCodes.CONFLICT, 'User Already Exists');
      }
      throw error;
    }
  }

  public static async updateUser(ctx: RouterContext) {
    const { id } = ctx.params;
    const user: IUser = ctx.request.body as IUser;
    ctx.body = await UserService.updateUser(id, user);
  }

  public static async deleteUser(ctx: RouterContext) {
    const { id } = ctx.params;
    await UserService.deleteUser(id);
    ctx.body = {};
  }
}
