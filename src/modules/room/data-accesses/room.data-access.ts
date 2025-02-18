import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../schemas/room.schema';
import { PaginatedQueryParams, QueryParams } from '../../../common/interfaces/data-access';
import { BaseDataAccess } from '../../../common/data-accesses/base-data-access';
import { PatchRoom, PostRoom } from '../room.interface';

@Injectable()
export class RoomDataAccess extends BaseDataAccess<RoomDocument> {
  constructor(@InjectModel(Room.name) private RoomModel: Model<RoomDocument>) {
    super(RoomModel);
  }

  async getRoom(params: QueryParams): Promise<any> {
    return this.findOne(params);
  }

  async getRooms(params: PaginatedQueryParams): Promise<any> {
    return this.get(params);
  }

  async createRoom(payload: PostRoom): Promise<any> {
    return this.create(payload);
  }

  async patchRoom(roomId: string, payload: PatchRoom): Promise<any> {
    return this.updateOne({ _id: roomId }, payload);
  }

  async deleteRoom(roomId: string): Promise<any> {
    return this.deleteOne({ _id: roomId });
  }
}
