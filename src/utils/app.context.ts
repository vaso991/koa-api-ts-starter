import { Request } from 'koa';
import { RouterContext } from 'koa-router';
import type { Files } from 'formidable';

/**
 * Declaration for application state object.
 * Use this as context type in controllers.
 */
export type AppState = {
  user: {
    email: string;
    id: string;
    jwt?: string;
  };
};

interface AppRequest<RequestBodyT = any> extends Request {
  body?: RequestBodyT;
  files?: Files;
}

interface AppDefaultContext<RequestBodyT> extends RouterContext {
  request: AppRequest<RequestBodyT>;
  state: AppState;
}

export interface AppContext<RequestBodyT = any>
  extends AppDefaultContext<RequestBodyT> {}
