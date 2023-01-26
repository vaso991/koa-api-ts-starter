import Router from 'koa-router';
import { HelloWorldController } from './HelloWorld.Controller';

const router = new Router({
    prefix: '/hello'
});

router.get('/', HelloWorldController.GetHelloWorld);

export { router as HelloWorldRouter };