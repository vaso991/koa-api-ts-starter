import { Model, ModelObject } from 'objection';
import { timestampPlugin } from 'objection-timestamps';

class UserModel extends timestampPlugin()(Model) {
  static tableName = 'Users';

  static timestamp = true;

  id: string;
  email: string;
  password: string;
  updated_at: string;
  created_at: string;
}

type UserModelType = ModelObject<UserModel>;
export default UserModel;
export { UserModel };
export type { UserModelType };
