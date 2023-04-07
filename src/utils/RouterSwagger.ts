import Router from 'koa-router';
import { KoaRouterSwagger } from 'koa-router-zod-swagger';

export const RouterSwagger = (router: Router) => {
  return KoaRouterSwagger(router, {
    routePrefix: false,
    title: 'Test Api',
    swaggerOptions: {
      spec: {
        info: {
          version: '1.0.0',
          description: 'This is test api specs',
        },
      },
    },
  });
};
