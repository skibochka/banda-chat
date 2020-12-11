import Messages from '../models/message';
import IMessage from '../interfaces/message.interface';
import IGetMessages from '../interfaces/getMessages.interface';
import IUpdateMessages from '../interfaces/updateMessages.interface';

class MessageService {
  public async createMessage(data): Promise<IMessage> {
    return Messages.create(data);
  }

  public async updateMessage(data: IUpdateMessages): Promise<object> {
    return Messages.updateOne({ _id: data.msgId }, { content: data.content });
  }

  public async deleteMessage(_id: string): Promise<object> {
    return Messages.deleteOne({ _id });
  }

  public async getMessages(data: IGetMessages) {
    return Messages.find({ })
      .skip(await Messages.count({}) - data.limit)
      .limit(data.limit);
  }
}

export default new MessageService();
