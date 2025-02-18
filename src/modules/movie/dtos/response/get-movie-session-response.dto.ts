import { ApiProperty } from '@nestjs/swagger';

export class GetMovieSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  timeSlot: number;

  @ApiProperty()
  room: string;

  @ApiProperty()
  status: number;
}
