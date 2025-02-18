import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetRoomRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  projection?: string;
}
