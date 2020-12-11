import { Schema, Model } from 'mongoose';
import { connection } from './connection';
import Room from '../interfaces/room.interface';

class RoomModel {
  RoomSchema(): Schema {
    return new Schema(
      {
        roomName: {
          type: String,
          required: true,
        },
        members: {
          type: Object,
          required: true,
        },
      },
      {
        collection: 'rooms',
        versionKey: false,
      },
    );
  }

  get(): Model<Room> {
    return connection.model('rooms', this.RoomSchema());
  }
}

export default new RoomModel().get();
