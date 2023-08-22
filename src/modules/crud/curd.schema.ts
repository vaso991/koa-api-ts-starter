import z from 'zod';

const CrudSchema = z.object({
  param1: z.string(),
  param2: z.string(),
});
type CrudType = z.infer<typeof CrudSchema>;

export { CrudSchema };
export type { CrudType };
