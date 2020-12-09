import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import MessageValidation from './validation';
import ValidationError from '../../middleware/ValidationError';
import MessageService from '../../services/messageService';
import IGetMessages from '../../interfaces/getMessages.interface';
import IUpdateMessages from '../../interfaces/updateMessages.interface';

export class Client extends EventEmitter {
  constructor(socket: Socket, user) {
    super();
    this.user = user;

    this.socket = socket;
    this.socket.on('msg', (message) => this.handleMessages(message));
    this.socket.on('msg.get', (data) => this.getMessages(data));
    this.socket.on('msg.update', (data) => this.updateMessage(data));
    this.socket.on('msg.delete', (msgId) => this.deleteMessage(msgId));
  }

  private user: any

  private socket: Socket

  static async build(socket) {
    try {
      // const userData = await validateToken(socket.token);
      return new this(socket, {});
    } catch (e) {
      socket.close();
      return null;
    }
  }

  async handleMessages(message): Promise<boolean> {
    const { error } = MessageValidation.checkMessage(message);

    if (error) throw new ValidationError(error.details);

    await MessageService.createMessage(message);

    return this.emit('new-event', { event: 'msg', content: message });
  }

  async getMessages(data: IGetMessages): Promise<boolean> {
    const { error } = MessageValidation.getMessages(data);

    if (error) throw new ValidationError(error.details);

    const messages = await MessageService.getMessages(data);

    return this.socket.emit('msg.get', messages);
  }

  async updateMessage(data: IUpdateMessages): Promise<boolean> {
    const { error } = MessageValidation.updateMessages(data);

    if (error) throw new ValidationError(error.details);

    await MessageService.updateMessage(data);

    return this.emit('new-event', { event: 'msg.update', content: data });
  }

  async deleteMessage(msgId: string): Promise<boolean> {
    const { error } = MessageValidation.deleteMessage(msgId);

    if (error) throw new ValidationError(error.details);

    await MessageService.deleteMessage(msgId);

    return this.emit('new-event', { event: 'msg.delete', content: msgId });
  }
}
