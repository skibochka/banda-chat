import { Schema, Model } from 'mongoose';
import { connection } from './connection';
import IUsers from '../interfaces/users.interface';

class UserModel {
  UsersSchema(): Schema {
    return new Schema(
      {
        login: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
      {
        collection: 'users',
        versionKey: false,
      },
    );
  }

  get(): Model<IUsers> {
    return connection.model('users', this.UsersSchema());
  }
}

export default new UserModel().get();
