import { Context } from 'koa';
import { HelloWorldService } from './HelloWorld.Service';

export class HelloWorldController {
  public static GetHelloWorld(ctx: Context) {
    ctx.body = HelloWorldService.GetHelloWorld();
  }
}
