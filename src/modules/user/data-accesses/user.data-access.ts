import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { BaseDataAccess } from '../../../common/data-accesses/base-data-access';
import { PatchUser, PostUser } from '../user.interface';
import { PaginatedQueryParams, QueryParams } from '../../../common/interfaces/data-access';

@Injectable()
export class UserDataAccess extends BaseDataAccess<UserDocument> {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
    super(UserModel);
  }

  async getUser(params: QueryParams): Promise<any> {
    return this.findOne(params);
  }

  async getUsers(params: PaginatedQueryParams): Promise<any> {
    return this.get(params);
  }

  async createUser(payload: PostUser): Promise<any> {
    return this.create(payload);
  }

  async patchUser(userId: string, payload: PatchUser): Promise<any> {
    return this.updateOne({ _id: userId }, payload);
  }

  async deleteUser(userId: string): Promise<any> {
    return this.deleteOne({ _id: userId });
  }
}
