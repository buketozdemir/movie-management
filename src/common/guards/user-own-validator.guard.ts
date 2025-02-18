import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { UserPermissionDeniedException } from '../errors';
import { UserRole } from '../enums';

export class UserOwnValidatorGuard implements CanActivate {
  protected logger = new Logger(UserOwnValidatorGuard.name);
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user?.roles?.includes(UserRole.Manager)) return true;

    if (request?.user?.id !== request?.params?.userId) {
      throw new UserPermissionDeniedException();
    }

    return true;
  }
}
