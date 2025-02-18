import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPostDto {
  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  userName: string;

  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;
}
