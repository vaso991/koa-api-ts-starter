/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { App } from '../../app';
import { LoginResponseType } from './auth.schema';

describe('Auth', () => {
  let app: App;
  let user: LoginResponseType;

  beforeAll(async () => {
    app = await App.init();
  });

  afterAll(() => {
    app.exit();
  });

  it('PORT /register', async () => {
    const response = await request(app.getKoaApp().callback())
      .post('/auth/register')
      .send({
        email: 'auth@example.com',
        password: 'p@assword',
        passwordConfirm: 'p@assword',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
    });
  });

  it('PORT /login', async () => {
    const response = await request(app.getKoaApp().callback())
      .post('/auth/login')
      .send({
        email: 'auth@example.com',
        password: 'p@assword',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    user = response.body;
  });

  it('GET /me', async () => {
    const response = await request(app.getKoaApp().callback())
      .get('/auth/me')
      .set('Authorization', `Bearer ${user.accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
    });
  });

  it('POST /revoke', async () => {
    const response = await request(app.getKoaApp().callback())
      .post('/auth/revoke')
      .send({ refreshToken: user.refreshToken });
    expect(response.statusCode).toBe(200);

    const refreshTokenResponse = await request(app.getKoaApp().callback())
      .post('/auth/refresh')
      .send({ refreshToken: user.refreshToken });

    expect(refreshTokenResponse.statusCode).toBe(401);
  });
});
