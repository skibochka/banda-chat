import { Schema, Model } from 'mongoose';
import { connection } from './connection';
import { User } from '../interfaces/user.interface';

class UsersModel {
  RoomSchema(): Schema {
    return new Schema(
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
          required: true,
        },
        rooms: {
          type: Object,
          required: true,
        },
      },
      {
        collection: 'user',
        versionKey: false,
      },
    );
  }

  get(): Model<User> {
    return connection.model('user', this.RoomSchema());
  }
}

export default new UsersModel().get();
