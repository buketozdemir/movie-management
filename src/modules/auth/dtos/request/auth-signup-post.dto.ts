import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SignUpPostDto {
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
  userName: string;

  @IsString()
  @ApiProperty({ required: true })
  password: string;
}
