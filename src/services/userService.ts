import * as bcrypt from 'bcrypt';
import Users from '../models/user';
import { IUser } from '../interfaces/user.interface';

export class UserService {
  public async getAll(): Promise<IUser[]> {
    return Users.find({});
  }

  public async getOne(login: string): Promise<IUser> {
    return Users.findOne({ login });
  }

  public async create(body: IUser): Promise<IUser> {
    const creds = body;
    creds.password = await bcrypt.hash(body.password, 10);
    return Users.create(creds);
  }

  public async updateUser(data: IUser) {
    return Users.updateOne({ login: data.login }, { rooms: data.rooms });
  }
}
export default new UserService();
