import { Socket } from 'socket.io';
import * as JwtService from 'jsonwebtoken';
import Validation from './validation';
import ValidationError from '../../middleware/ValidationError';
import MessageService from '../../services/messageService';
import RoomService from '../../services/roomService';
import UserService from '../../services/userService';
import IGetMessages from '../../interfaces/getMessages.interface';
import IUpdateMessages from '../../interfaces/updateMessages.interface';
import { IRoom } from '../../interfaces/room.interface';
import { IMessage } from '../../interfaces/message.interface';
import authConstants from '../../constants/constants';
import { IUser } from '../../interfaces/user.interface';


export class Client {
  constructor(socket: Socket, user) {
    this.user = user;
    this.joinRooms();

    this.socket = socket;
    this.socket.on('msg', (message) => this.handleMessages(message));
    this.socket.on('msg.get', (data) => this.getMessages(data));
    this.socket.on('msg.update', (data) => this.updateMessage(data));
    this.socket.on('msg.delete', (msgId) => this.deleteMessage(msgId));
    this.socket.on('room.create', (data) => this.createRoom(data));
    this.socket.on('room.join', (room) => this.joinRoom(room));
    this.socket.on('room.msg', (message) => this.roomMessage(message));
    this.socket.on('room.get.all', () => this.getRooms());
    this.socket.on('user.get', () => this.getUser());
    this.socket.on('user.change.name', (newName) => this.changeName(newName));
  }

  private user: IUser

  private socket: Socket

  static async build(socket) {
    try {
      const { name, email } = JwtService.verify(socket.handshake.query.token, authConstants.secret);

      return new this(socket, { name, email });
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

    return this.socket.emit('msg.update', { data });
  }

  async deleteMessage(msgId: string): Promise<boolean> {
    const { error } = Validation.deleteMessage(msgId);

    if (error) throw new ValidationError(error.details);

    await MessageService.deleteMessage(msgId);

    return this.socket.emit('msg.delete', { msgId });
  }

  async createRoom(data: IRoom): Promise<boolean> {
    const { error } = await Validation.createRoom(data);

    if (error) throw new ValidationError(error.details);

    const room: IRoom = await RoomService.findRoom(data.roomName);
    if (!room) {
      const newRoom = await RoomService.createRoom({ roomName: data.roomName, members: [this.user.email] });
      const { rooms } = await UserService.getOne(this.user.email);
      rooms.push(data.roomName);
      await UserService.updateUser(this.user.email,{ rooms });

      return this.socket.emit('room.create', newRoom.roomName);
    }

    throw new Error('Such room have already exist');
  }

  async joinRoom(data: IRoom) {
    const { error } = Validation.joinRoom(data);

    if (error) throw new ValidationError(error.details);

    const room: IRoom = await RoomService.findRoom(data.roomName);
    if (room) {
      if (!room.members.includes(this.user.email)) {
        room.members.push(this.user.email);
        await RoomService.addMember(room);
        const { rooms } = await UserService.getOne(this.user.email);
        rooms.push(data.roomName);
        await UserService.updateUser(this.user.email,{ rooms });

        this.socket.join(room.roomName);
        return this.socket.emit('room.join', data.roomName);
      }

      return this.socket.join(room.roomName);
    }

    throw new Error('Such room does not exist');
  }

  async roomMessage(roomMessage: IMessage) {
    const { error } = Validation.checkMessage(roomMessage);

    if (error) throw new ValidationError(error.details);

    const data: IMessage = {
      content: roomMessage.content,
      roomName: roomMessage.roomName,
      sender: this.user.name,
    };

    await MessageService.createMessage(data);
    return this.socket.to(roomMessage.roomName).emit('room.msg', data);
  }

  async getRooms() {
    const { rooms } = await UserService.getOne(this.user.email);
    return this.socket.emit('room.get.all', rooms);
  }

  async joinRooms(): Promise<void> {
    const { rooms } = await UserService.getOne(this.user.email);
    if (rooms) {
      rooms.forEach((room) => this.socket.join(room));
    }
  }

  async getUser(): Promise<boolean> {
    const user: IUser = await UserService.getOne(this.user.email);
    return this.socket.emit('user.get', user);
  }

  async changeName(newName): Promise<boolean> {
    await UserService.updateUser(this.user.email, { name: newName });
    return this.socket.emit('user.change.name', newName);
  }
}
