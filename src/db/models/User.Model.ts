import { Model, ModelObject, Validator } from 'objection';
import { timestampPlugin } from 'objection-timestamps';
import { UserSchema, UserUpdateSchema } from '../../modules/users/User.Schema';
import { ObjectionZodValidator } from '../../utils/ObjectionZodValidator';

class User extends timestampPlugin()(Model) {
  static tableName = 'Users';
  static timestamp = true;
  static virtualAttributes = ['fullName'];

  id: string;
  email!: string;
  firstName: string;
  lastName: string;
  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  static createValidator(): Validator {
    return ObjectionZodValidator(UserSchema, UserUpdateSchema);
  }
}
type IUser = ModelObject<User>;
export { User, IUser };
