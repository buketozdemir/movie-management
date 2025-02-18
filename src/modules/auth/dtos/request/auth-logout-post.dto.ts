import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthLogoutPostDto {
  @IsString()
  @ApiProperty({ required: true })
  token: string;
}
