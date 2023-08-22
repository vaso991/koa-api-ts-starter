import { AppEnv } from '@App/app.env';
import IORedis from 'ioredis';

// Initialize redis client
const redisClient = new IORedis(AppEnv.REDIS_URL);
export { redisClient };
