import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PostUserRequestDto {
  @IsString()
  @ApiProperty({ required: true })
  userName: string;

  @IsString()
  @ApiProperty({ required: true })
  firstName: string;

  @IsString()
  @ApiProperty({ required: true })
  lastName: string;

  @IsDate()
  @ApiProperty({ required: true })
  @Type(() => Date)
  birthDate: Date;

  @IsString()
  @ApiProperty({ required: true })
  password: string;
}
