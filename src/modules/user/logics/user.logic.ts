import { Injectable, Logger } from '@nestjs/common';
import { CheckPasswordMatchParams } from '../user.interface';
import { OldPasswordMismatchException, PasswordMismatchException } from '../../../common/errors';
import { Crypt } from '../../../common/utils/crypt';

@Injectable()
class UserLogic {
  logger = new Logger(UserLogic.name);

  static async checkPasswordMatch(params: CheckPasswordMatchParams) {
    const { password, confirmPassword, oldPassword, user } = params;
    const { password: userOldPassword } = user;
    if (password !== confirmPassword) {
      throw new PasswordMismatchException();
    }

    if (!(await Crypt.comparePassword(oldPassword, userOldPassword))) {
      throw new OldPasswordMismatchException();
    }
  }
}

export default UserLogic;
