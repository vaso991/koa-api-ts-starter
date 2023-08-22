import request from 'supertest';
import { App } from '../src/app';
import UserModel from '@App/db/models/user.model';

export const TEST_USERNAME = 'test@example.com';
export const TEST_PASSWORD = 'password';

export const registerTestUser = async (
  app: App,
  email?: string,
  password?: string,
) => {
  return request(app.getKoaApp().callback())
    .post('/auth/register')
    .send({
      email: email || TEST_USERNAME,
      password: password || TEST_PASSWORD,
      passwordConfirm: password || TEST_PASSWORD,
    });
};
export const loginTestUser = async (
  app: App,
  email?: string,
  password?: string,
) => {
  return request(app.getKoaApp().callback())
    .post('/auth/login')
    .send({
      email: email || TEST_USERNAME,
      password: password || TEST_PASSWORD,
    });
};

export const deleteTestUser = async () => {
  await App.init();
  await UserModel.query().where('email', TEST_USERNAME).delete();
};
