import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserDataAccess } from '../data-accesses/user.data-access';
import { PaginationFilterOptions } from '../../../common/interfaces/pagination';
import { CheckUserParams, DeleteUser, GetUsers, PatchUser, PostChangePassword, PostUser } from '../user.interface';
import { QueryParams } from '../../../common/interfaces/data-access';
import { UserStatus } from '../user.enum';
import { UserAlreadyExistsException, UserNotFoundException } from '../../../common/errors';
import { UserRole } from '../../../common/enums';
import { ConfigService } from '@nestjs/config';
import { Crypt } from '../../../common/utils/crypt';
import UserLogic from '../logics/user.logic';
import * as moment from 'moment';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly userDataAccess: UserDataAccess,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(options: PaginationFilterOptions<GetUsers>) {
    return this.userDataAccess.getUsers(options);
  }

  async getUser(options: QueryParams) {
    return this.userDataAccess.getUser(options);
  }

  async getUserById(userId: string, options: QueryParams) {
    options.filter = { _id: userId };
    return this.userDataAccess.getUser(options);
  }

  async createUser(payload: PostUser) {
    payload.status = UserStatus.Active;
    const { userName, password } = payload;
    await this.checkUserExistence({ userName, mustExist: false });
    payload.roles = payload.roles || [UserRole.Customer];
    payload.status = payload.status || UserStatus.Active;
    payload.password = await Crypt.hashPassword(password);
    const user = await this.userDataAccess.createUser(payload);
    return { id: user._id, firstName: user.firstName, lastName: user.lastName, userName: user.userName };
  }

  async updateUser(userId: string, payload: PatchUser) {
    await this.checkUserExistence({ userId, mustExist: true });
    await this.userDataAccess.patchUser(userId, payload);
    return true;
  }

  async deleteUser(userId: string, payload: DeleteUser) {
    await this.checkUserExistence({ userId, mustExist: true });
    const { deletedBy } = payload;
    await this.userDataAccess.patchUser(userId, { status: UserStatus.Deleted, updatedBy: deletedBy, deletedBy });
    return true;
  }

  async changePassword(userId: string, payload: PostChangePassword) {
    const user = await this.checkUserExistence({ userId, mustExist: true, projection: 'password' });
    await UserLogic.checkPasswordMatch({ user, ...payload });
    const { password } = payload;
    const hashedPassword = await Crypt.hashPassword(password);
    await this.userDataAccess.patchUser(userId, { password: hashedPassword, updatedBy: userId });
    return true;
  }

  async checkUserExistence(params: CheckUserParams) {
    const { userId, userName, mustExist, projection } = params;
    let user: any = {};
    if (userId) {
      user = await this.userDataAccess.getUser({ filter: { _id: userId }, projection });
    } else if (userName) {
      user = await this.userDataAccess.getUser({ filter: { userName }, projection });
    }
    if (mustExist) {
      if (!user) {
        throw new UserNotFoundException();
      }
    } else {
      if (user) {
        throw new UserAlreadyExistsException();
      }
    }
    return user;
  }

  async onModuleInit() {
    await this.createAdminUserIfNotExists();
  }

  private async createAdminUserIfNotExists() {
    const adminUserName = 'admin';
    const adminPassword = this.configService.get<string>('ADMIN_USER.PASSWORD') || 'admin';
    const adminUser = await this.userDataAccess.getUser({ filter: { userName: adminUserName } });
    if (!adminUser) {
      await this.createUser({
        birthDate: moment().subtract(20, 'years').toDate(),
        firstName: adminUserName,
        lastName: adminUserName,
        password: adminPassword,
        userName: adminUserName,
        roles: [UserRole.Manager],
      });
    }
  }
}
