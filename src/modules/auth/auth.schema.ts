import z from 'zod';

const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(30),
});
type AuthLoginType = z.infer<typeof AuthLoginSchema>;

export { AuthLoginSchema };
export type { AuthLoginType };

const AuthRegisterSchema = AuthLoginSchema.merge(
  z.object({
    passwordConfirm: z.string().min(3).max(30),
  }),
).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ['passwordConfirm'],
});
type AuthRegisterType = z.infer<typeof AuthRegisterSchema>;

export { AuthRegisterSchema };
export type { AuthRegisterType };

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;

export { RefreshTokenSchema };
export type { RefreshTokenType };

type LoginResponseType = {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

export type { LoginResponseType };
