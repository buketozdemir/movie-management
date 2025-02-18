import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetMovieRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  projection?: string;
}
