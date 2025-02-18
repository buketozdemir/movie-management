import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class WatchMovieRequestDto {
  @IsMongoId()
  @ApiProperty({ required: true })
  ticketId: string;
}
