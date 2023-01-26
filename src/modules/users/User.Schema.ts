import { z } from 'zod';

const UserSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  })
  .strict();

const UserUpdateSchema = z
  .object({
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .strict();

const UserIdSchema = z.object({
  id: z.string().uuid(),
});

type IUser = z.infer<typeof UserSchema>;

export { IUser, UserSchema, UserUpdateSchema, UserIdSchema };
