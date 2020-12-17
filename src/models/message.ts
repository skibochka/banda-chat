import { Schema, Model } from 'mongoose';
import { connection } from './connection';
import { Message } from '../interfaces/message.interface';

class MessageModel {
  MessagesSchema(): Schema {
    return new Schema(
      {
        content: {
          type: String,
          required: true,
        },
        sender: {
          type: String,
          required: true,
        },
        roomName: {
          type: String,
          required: true,
        },
      },
      {
        collection: 'messages',
        versionKey: false,
        timestamps: true,
      },
    );
  }

  get(): Model<Message> {
    return connection.model('messages', this.MessagesSchema());
  }
}

export default new MessageModel().get();
