import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import MessageValidation from './validation';
import ValidationError from '../../middleware/ValidationError';
import MessageService from '../../services/messageService';
import IGetMessages from '../../interfaces/getMessages.interface';

export class Client extends EventEmitter {
  constructor(socket: Socket, user) {
    super();
    this.user = user;

    this.socket = socket;
    this.socket.on('msg', (message) => this.handleMessages(message));
    this.socket.on('msg.get', (data) => this.getMessages(data));
    this.socket.on('msg.update', (message) => this.handleMessages(message));
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

    return this.socket.emit('msg', message);
  }

  async getMessages(data: IGetMessages): Promise<boolean> {
    const { error } = MessageValidation.checkMessage(data);

    if (error) throw new ValidationError(error.details);

    await MessageService.getMessages(data);
    return true;
  }
}
