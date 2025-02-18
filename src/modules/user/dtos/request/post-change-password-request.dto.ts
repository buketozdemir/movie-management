import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PostChangePasswordRequestDto {
  @IsString()
  @ApiProperty({ required: true })
  oldPassword: string;

  @IsString()
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @ApiProperty({ required: true })
  confirmPassword: string;
}
