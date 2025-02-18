import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUserRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  projection?: string;
}
