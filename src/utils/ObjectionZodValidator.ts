import { Pojo, Validator, ValidatorArgs } from 'objection';
import { AnyZodObject } from 'zod';

class ObjectionZodValidatorClass extends Validator {
  zodObject: AnyZodObject;
  constructor(zodObject: AnyZodObject) {
    super();
    this.zodObject = zodObject;
  }
  validate(args: ValidatorArgs): Pojo {
    const json = args.json;
    this.zodObject.parse(json);
    return json;
  }
}
export const ObjectionZodValidator = (zodObject: AnyZodObject) => new ObjectionZodValidatorClass(zodObject);