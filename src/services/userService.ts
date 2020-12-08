import * as bcrypt from 'bcrypt';
import { injectable } from 'inversify';
import Users from '../models/user';
import IUsers from '../interfaces/user.interface';

@injectable()
export class UserService {
  public async getAll(): Promise<IUsers[]> {
    return Users.find({});
  }

  public async getOne(login: string): Promise<IUsers> {
    return Users.findOne({ login });
  }


  public async create(body: IUsers): Promise<IUsers> {
    const creds = body;
    creds.password = await bcrypt.hash(body.password, 10);
    return Users.create(creds);
  }
}
