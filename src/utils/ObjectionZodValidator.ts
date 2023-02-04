import { Pojo, Validator, ValidatorArgs } from 'objection';
import { AnyZodObject } from 'zod';

class ObjectionZodValidatorClass extends Validator {
  insertZodSchema: AnyZodObject;
  updateZodSchema?: AnyZodObject;
  constructor(insertZodSchema: AnyZodObject, updateZodSchema?: AnyZodObject) {
    super();
    this.insertZodSchema = insertZodSchema;
    this.updateZodSchema = updateZodSchema;
  }
  validate({ json, options }: ValidatorArgs): Pojo {
    if (options.patch) {
      if (this.updateZodSchema) {
        return this.updateZodSchema.parse(json);
      } else {
        return this.insertZodSchema.partial().parse(json);
      }
    } else {
      return this.insertZodSchema.parse(json);
    }
  }
}
export const ObjectionZodValidator = (
  insertZodSchema: AnyZodObject,
  updateZodSchema?: AnyZodObject,
) => new ObjectionZodValidatorClass(insertZodSchema, updateZodSchema);
