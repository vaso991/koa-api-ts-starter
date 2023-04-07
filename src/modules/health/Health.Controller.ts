import { RouterContext } from 'koa-router';
import { Db } from '../../db';
import { StatusCodes } from 'http-status-codes';

export class HealthController {
  public static async checkHealth(ctx: RouterContext) {
    const knex = await Db.get();
    try {
      await knex.raw('select 1+1 as result');
      ctx.status = StatusCodes.OK;
      ctx.body = {
        status: 1,
      };
    } catch (error) {
      ctx.status = StatusCodes.SERVICE_UNAVAILABLE;
      ctx.body = {
        status: 0,
      };
    }
  }
}
