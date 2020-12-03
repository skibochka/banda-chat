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
   * @method create
   * @param {IUsers} body user credentials
   * @returns {Promise<IUsers>} created user
   */
  public async create(body: IUsers): Promise<IUsers> {
    return Users.create(body);
  }
}

export default new UsersServices();

