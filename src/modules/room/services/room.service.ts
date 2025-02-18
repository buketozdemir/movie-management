import { Injectable } from '@nestjs/common';
import { RoomDataAccess } from '../data-accesses/room.data-access';
import { PaginationFilterOptions } from '../../../common/interfaces/pagination';
import { CheckRoomParams, GetRooms, PatchRoom, PostRoom } from '../room.interface';
import { QueryParams } from '../../../common/interfaces/data-access';
import { RoomAlreadyExistsException, RoomNotFoundException } from '../../../common/errors';
import { RoomStatus } from '../room.enum';

@Injectable()
export class RoomService {
  constructor(private readonly roomDataAccess: RoomDataAccess) {}

  async getRooms(options: PaginationFilterOptions<GetRooms>) {
    return this.roomDataAccess.getRooms(options);
  }

  async getRoomById(roomId: string, options: QueryParams) {
    options.filter = { _id: roomId };
    return this.roomDataAccess.getRoom(options);
  }

  async getRoom(room: string, options: QueryParams) {
    options.filter = { room };
    return this.roomDataAccess.getRoom(options);
  }

  async createRoom(payload: PostRoom) {
    const { name } = payload;
    await this.checkRoomExistence({ name, mustExist: false });
    payload.status = payload.status || RoomStatus.Active;
    const room = await this.roomDataAccess.createRoom(payload);
    return { id: room._id, name: room.name, status: room.status };
  }

  async updateRoom(roomId: string, payload: PatchRoom) {
    await this.checkRoomExistence({ roomId, mustExist: true });
    await this.roomDataAccess.patchRoom(roomId, payload);
    return true;
  }

  async deleteRoom(roomId: string) {
    await this.checkRoomExistence({ roomId, mustExist: true });
    await this.roomDataAccess.deleteRoom(roomId);
    return true;
  }

  async checkRoomExistence(params: CheckRoomParams) {
    const { roomId, name, mustExist } = params;
    let room: any = {};
    if (roomId) {
      room = await this.roomDataAccess.getRoom({ filter: { _id: roomId } });
    } else if (name) {
      room = await this.roomDataAccess.getRoom({ filter: { name } });
    }
    if (mustExist) {
      if (!room) {
        throw new RoomNotFoundException();
      }
    } else {
      if (room) {
        throw new RoomAlreadyExistsException();
      }
    }
    return room;
  }
}
