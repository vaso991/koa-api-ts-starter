/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { App } from '../../app';

describe('Auth', () => {
  let app: App;

  beforeAll(async () => {
    app = await App.init();
  });

  afterAll(() => {
    app.exit();
  });

  it('PORT /crud', async () => {
    const response = await request(app.getKoaApp().callback())
      .post('/crud')
      .send({
        param1: 'test_string',
        param2: 'test_string2',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      param1: expect.any(String),
      param2: expect.any(String),
    });
  });

  it('GET /crud', async () => {
    const response = await request(app.getKoaApp().callback()).get('/crud');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
