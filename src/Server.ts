import 'reflect-metadata';
import { App } from './App';

const init = async () => {
  const app = await App.init();
  app.start();
};
void init();
