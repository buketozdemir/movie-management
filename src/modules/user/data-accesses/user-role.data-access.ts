import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { BaseDataAccess } from '../../../common/data-accesses/base-data-access';

@Injectable()
export class UserRoleDataAccess extends BaseDataAccess<UserDocument> {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
    super(UserModel);
  }

  async getRolesOfUser(userId: string) {
    const { roles } = await this.UserModel.findOne({ _id: userId }, 'roles');
    return { id: userId, roles };
  }

  async addRoleToUser(userId: string, roleId: number): Promise<boolean> {
    await this.UserModel.updateOne({ _id: userId }, { $push: { roles: roleId } });
    return true;
  }

  async deleteRoleFromUser(userId: string, roleId: number): Promise<boolean> {
    await this.UserModel.updateOne({ _id: userId }, { $pull: { roles: roleId } });
    return true;
  }
}
