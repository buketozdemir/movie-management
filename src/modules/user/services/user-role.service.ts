import { Injectable } from '@nestjs/common';
import { UserRoleAlreadyExistsException, UserRoleNotFoundException } from '../../../common/errors';
import { UserRoleDataAccess } from '../data-accesses/user-role.data-access';
import { MetaParam } from '../../../common/interfaces/header';
import { UserService } from './user.service';
import { DeletedBy } from '../../../common/interfaces';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleDataAccess: UserRoleDataAccess,
    private readonly userService: UserService,
  ) {}

  async getRolesOfUser(userId: string) {
    await this.userService.checkUserExistence({ userId, mustExist: true });
    return this.userRoleDataAccess.getRolesOfUser(userId);
  }

  async addRoleToUser(userId: string, roleId: number, headers: MetaParam = {}) {
    const user = await this.userService.checkUserExistence({ userId, mustExist: true });
    if (user?.roles?.includes(roleId)) {
      throw new UserRoleAlreadyExistsException();
    }

    await this.userRoleDataAccess.addRoleToUser(userId, roleId);
    return true;
  }

  async deleteRoleFromUser(userId: string, roleId: number, payload: DeletedBy, headers: MetaParam = {}) {
    const user = await this.userService.checkUserExistence({ userId, mustExist: true });
    if (!user?.roles?.includes(roleId)) {
      throw new UserRoleNotFoundException();
    }
    await this.userRoleDataAccess.deleteRoleFromUser(userId, roleId);
    return true;
  }
}
