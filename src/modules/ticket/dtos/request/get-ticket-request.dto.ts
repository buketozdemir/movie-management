import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTicketRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  projection?: string;
}
