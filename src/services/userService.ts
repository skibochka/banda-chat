import * as bcrypt from 'bcrypt';
import Users from '../models/user';

import { IUser } from '../interfaces/user.interface';

export class UserService {
  public async getAll(): Promise<IUser[]> {
    return Users.find({});
  }

  public async getOne(email: string): Promise<IUser> {
    return Users.findOne({ email });
  }

  public async create(body) {
    const creds = body;
    creds.password = await bcrypt.hash(body.password, 10);
    return Users.create(creds);
  }

  public async updateUser(email, data: IUser) {
    return Users.updateOne({ email }, data);
  }
}
export default new UserService();
