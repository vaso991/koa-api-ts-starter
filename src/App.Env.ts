import dotenv from 'dotenv-flow';
import { z, ZodError } from 'zod';
dotenv.config();

const AppEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).optional().default('development'),
    PORT: z.preprocess((val) => Number(val), z.number()).default(8080),
    COOKIE_KEY: z.string().default('secret'),
    DATABASE_URL: z.string()
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