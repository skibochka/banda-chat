import Rooms from '../models/room';
import IRoom from '../interfaces/room.interface';

class RoomsService {
  public async createRoom(data): Promise<IRoom> {
    return Rooms.create(data);
  }

  public async findRoom(roomName): Promise<IRoom> {
    return Rooms.findOne({ roomName });
  }
}

export default new RoomsService();
