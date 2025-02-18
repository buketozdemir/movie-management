import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class AccessTokenPostDto {
  @IsString()
  @ApiProperty({ required: true })
  refreshToken: string;

  @IsMongoId()
  @ApiProperty({ required: true })
  user: string;
}
