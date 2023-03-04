import request from 'supertest';
import { App } from '../src/App';

let app: App;

describe('App is healthy', () => {
  it('should return status 200', async () => {
    const response = await request(app.getKoaApp().callback()).get('/health');
    expect(response.statusCode).toBe(200);
  });
});

beforeEach(async () => {
  app = await App.init();
});

afterEach(() => {
  app.closeDbConnection();
});
