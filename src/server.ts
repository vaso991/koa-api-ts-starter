import 'reflect-metadata';
import { App } from './app';

const init = async () => {
  const app = await App.init();
  app.start();
};
void init();
