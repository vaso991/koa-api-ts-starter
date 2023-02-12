import { User } from '../../db/models/User.Model';
import { IUser, IUserOptional } from './User.Schema';

export class UserService {
  public static async getAllUsers(query: IUserOptional = {}): Promise<User[]> {
    return User.query().where(query);
  }

  public static async getUserById(id: string): Promise<User> {
    return await User.query().findById(id).throwIfNotFound();
  }

  public static async addNewUser(user: IUser): Promise<User> {
    return await User.query().insert(user);
  }

  public static async updateUser(id: string, user: IUser): Promise<User> {
    return await User.query().patchAndFetchById(id, user);
  }
  public static async deleteUser(id: string) {
    return await User.query().deleteById(id).throwIfNotFound();
  }
}
