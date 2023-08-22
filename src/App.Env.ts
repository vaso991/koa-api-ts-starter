import dotenv from 'dotenv-flow';
import { z, ZodError } from 'zod';

dotenv.config();

// Describe application enviroment variables and pass validation.
const AppEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  PORT: z.coerce.number().default(8080),
  COOKIE_KEY: z.string().default('secret'),
  DATABASE_URL: z.string(),
  DATABASE_DEBUG: z.coerce.boolean().default(false),
  JWT_ISSUER: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXP: z.number().default(60 * 60 * 24 * 24), // 24 days,
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
});
let AppEnv: z.infer<typeof AppEnvSchema>;
try {
  AppEnv = AppEnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    throw error.issues;
  }
  throw error;
}
export { AppEnv };
