import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as mongoose from 'mongoose';

export const ObjectIdParam = createParamDecorator((fieldName: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.params[fieldName];

  const message = [fieldName + ' must be a ObjectId'];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new BadRequestException(message);
  }
  return value;
});
