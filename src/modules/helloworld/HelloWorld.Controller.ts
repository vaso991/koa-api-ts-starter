import { Context } from 'koa';
import { HelloWorldService } from './HelloWorld.Service';

export class HelloWorldController {
  public static async GetHelloWorld(ctx: Context) {
    ctx.body = await HelloWorldService.GetHelloWorld();
  }
}