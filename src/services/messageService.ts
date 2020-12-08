import Messages from '../models/message';
import IMessage from '../interfaces/message.interface';
import IGetMessages from '../interfaces/getMessages.interface';

class MessageService {
  public async createMessage(data): Promise<IMessage> {
    return Messages.create(data);
  }

  public async updateMessage(_id: string, data: object): Promise<object> {
    return Messages.updateOne({ _id }, data);
  }

  public async deleteMessage(_id: string): Promise<object> {
    return Messages.deleteOne({ _id });
  }

  public async getMessages(data: IGetMessages) {
    return Messages.find({ roomId: data.roomId })
      .skip(data.limit * data.page)
      .limit(data.limit)
      .exec();
  }
}

export default new MessageService();
