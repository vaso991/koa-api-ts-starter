import { Context, Next } from 'koa';
import { AnyZodObject } from 'zod';

interface IValidatorProps {
  query?: AnyZodObject;
  params?: AnyZodObject;
  body?: AnyZodObject;
}

export const ValidatorMiddleware = (props: IValidatorProps) => {
  return async (ctx: Context, next: Next) => {
    if (props.query) {
      await props.query.parseAsync(ctx.request.query);
    }
    if (props.params) {
      await props.params.parseAsync(ctx.params);
    }
    if (props.body) {
      await props.body.parseAsync(ctx.request.body);
    }
    return next();
  };
};