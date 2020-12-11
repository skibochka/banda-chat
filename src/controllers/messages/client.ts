import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import Validation from './validation';
import ValidationError from '../../middleware/ValidationError';
import MessageService from '../../services/messageService';
import RoomService from '../../services/roomService';
import IGetMessages from '../../interfaces/getMessages.interface';
import IUpdateMessages from '../../interfaces/updateMessages.interface';
import IRoom from '../../interfaces/room.interface';
import IMessage from '../../interfaces/message.interface';


export class Client extends EventEmitter {
  constructor(socket: Socket, user) {
    super();
    this.user = user;

    this.socket = socket;
    this.socket.on('msg', (message) => this.handleMessages(message));
    this.socket.on('msg.get', (data) => this.getMessages(data));
    this.socket.on('msg.update', (data) => this.updateMessage(data));
    this.socket.on('msg.delete', (msgId) => this.deleteMessage(msgId));
    this.socket.on('room.create', (data) => this.createRoom(data));
    this.socket.on('room.join', (room) => this.joinRoom(room));
    this.socket.on('room.msg', (message) => this.roomMessage(message));
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

  async handleMessages(message: IMessage): Promise<boolean> {
    const { error } = Validation.checkMessage(message);

    if (error) throw new ValidationError(error.details);

    await MessageService.createMessage(message);

    return this.socket.broadcast.emit('msg', message);
  }

  async getMessages(data: IGetMessages): Promise<boolean> {
    const { error } = Validation.getMessages(data);

    if (error) throw new ValidationError(error.details);

    const messages = await MessageService.getMessages(data);

    return this.socket.emit('msg.get', messages);
  }

  async updateMessage(data: IUpdateMessages): Promise<boolean> {
    const { error } = Validation.updateMessages(data);

    if (error) throw new ValidationError(error.details);

    await MessageService.updateMessage(data);

    return this.emit('new-event', { event: 'msg.update', content: data });
  }

  async deleteMessage(msgId: string): Promise<boolean> {
    const { error } = Validation.deleteMessage(msgId);

    if (error) throw new ValidationError(error.details);

    await MessageService.deleteMessage(msgId);

    return this.emit('new-event', { event: 'msg.delete', content: msgId });
  }

  async createRoom(data: IRoom): Promise<boolean> {
    const { error } = await Validation.createRoom(data);

    if (error) throw new ValidationError(error.details);

    const room: IRoom = await RoomService.findRoom(data.roomName);
    if (!room) {
      const newRoom = await RoomService.createRoom(data);
      return this.socket.emit('room.create', newRoom.roomName);
    }

    throw new Error('Such room have already exist');
  }

  async joinRoom(data: IRoom): Promise<void> {
    const { error } = Validation.joinRoom(data);

    if (error) throw new ValidationError(error.details);

    const room: IRoom = await RoomService.findRoom(data.roomName);
    if (room) {
      return this.socket.join(room.roomName);
    }

    throw new Error('Such room does not exist');
  }

  async roomMessage(roomMessage) {
    return this.socket.to(roomMessage.roomName).emit('room.msg', roomMessage);
  }
}
