import { z } from 'zod';

const UserSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
  })
  .strict();

const UserUpdateSchema = UserSchema.partial();

const UserIdSchema = z.object({
  id: z.string().uuid(),
});

type IUser = z.infer<typeof UserSchema>;

export { IUser, UserSchema, UserUpdateSchema, UserIdSchema };
