import { AppContext } from '@App/utils/app.context';
import { CrudType } from './curd.schema';
import { CrudService } from './crud.service';

export class CrudController {
  public static async Create(ctx: AppContext<CrudType>) {
    ctx.body = await CrudService.Create(ctx.request.body!);
  }

  public static async GetAll(ctx: AppContext) {
    ctx.body = await CrudService.GetAll();
  }

  public static async GetOneById(ctx: AppContext) {
    const { id } = ctx.params;
    ctx.body = await CrudService.GetById(id);
  }

  public static async Update(ctx: AppContext<CrudType>) {
    const { id } = ctx.params;
    ctx.body = await CrudService.Update(id, ctx.request.body!);
  }

  public static async Delete(ctx: AppContext) {
    const { id } = ctx.params;
    await CrudService.DeleteById(id);
    ctx.body = {
      success: true,
    };
  }
}
