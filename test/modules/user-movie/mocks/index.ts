import { RoomStatus } from '../../../../src/modules/room/room.enum';
import mongoose from 'mongoose';

export const roomName = 'Test Room X';
export const roomCapacity = 50;
export const roomStatus = RoomStatus.Active;
export const roomCreatedBy = new mongoose.Types.ObjectId().toString();
