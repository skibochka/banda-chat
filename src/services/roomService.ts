import Rooms from '../models/room';
import { IRoom } from '../interfaces/room.interface';

class RoomsService {
  public async createRoom(data: IRoom): Promise<IRoom> {
    return Rooms.create(data);
  }

  public async findRoom(roomName): Promise<IRoom> {
    return Rooms.findOne({ roomName });
  }

  public async addMember(room: IRoom): Promise<void> {
    return Rooms.updateOne({ roomName: room.roomName }, { members: room.members });
  }
}

export default new RoomsService();
