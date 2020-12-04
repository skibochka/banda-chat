import * as bcrypt from 'bcrypt';
import Users from '../models/users';
import IUsers from '../interfaces/users.interface';

class UsersServices {
  /**
   * @method getAll
   * @returns {Promise<IUsers[]>} list of users
   */
  public async getAll(): Promise<IUsers[]> {
    return Users.find({});
  }

  /**
   * @method getOne
   * @param {IUsers} login user credentials
   * @returns {Promise<IUsers>} one user
   */
  public async getOne(login: string): Promise<IUsers> {
    return Users.findOne({ login });
  }

  /**
   * @method create
   * @param {IUsers} body user credentials
   * @returns {Promise<IUsers>} created user
   */
  public async create(body: IUsers): Promise<IUsers> {
    const creds = body;
    creds.password = await bcrypt.hash(body.password, 10);
    return Users.create(creds);
  }
}

export default new UsersServices();
