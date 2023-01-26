import { Model, ModelObject } from 'objection';
import { timestampPlugin } from 'objection-timestamps';

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
}
type IUser = ModelObject<User>;
export { User, IUser };
