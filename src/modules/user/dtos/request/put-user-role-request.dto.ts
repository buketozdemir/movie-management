import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../common/enums';
import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class PutUserRoleRequestDto {
  @IsEnum(UserRole)
  @ApiProperty({
    required: true,
    enum: Object.values(UserRole).filter((value) => typeof value === 'number'),
    enumName: 'UserRole',
  })
  @Transform(({ value }) => {
    const userRole = Number(value);
    if (!(userRole in UserRole)) {
      throw new BadRequestException(`${userRole} is not a valid`);
    }
    return userRole as UserRole;
  })
  roleId: UserRole;
}
