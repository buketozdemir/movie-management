import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationRequestDto } from '../../../../common/dtos/request';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { UserStatus } from '../../user.enum';

export class GetUsersRequestDto extends IntersectionType(PaginationRequestDto) {
  @IsEnum(UserStatus)
  @ApiProperty({
    required: false,
    enum: Object.values(UserStatus).filter((value) => typeof value === 'number'),
    enumName: 'UserStatus',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const userStatusValue = Number(value);
    if (!(userStatusValue in UserStatus)) {
      throw new BadRequestException(`${userStatusValue} is not a valid`);
    }
    return userStatusValue as UserStatus;
  })
  status?: UserStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  userName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  lastName?: string;
}
