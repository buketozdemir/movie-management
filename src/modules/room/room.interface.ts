export interface GetRooms {
  name?: string;
  status?: number;
}

export interface PostRoom {
  name: string;
  capacity: number;
  status?: number;
  createdBy: string;
}

export interface PatchRoom {
  name?: string;
  capacity?: number;
  status?: number;
  updatedBy: string;
}

export interface CheckRoomParams {
  roomId?: string;
  name?: string;
  mustExist: boolean;
}
