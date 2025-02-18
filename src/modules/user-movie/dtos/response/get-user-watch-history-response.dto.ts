import { ApiProperty } from '@nestjs/swagger';

export class GetUserWatchHistoryResponseDto {
  @ApiProperty()
  movieName: string;

  @ApiProperty()
  movieReleaseDate: Date;

  @ApiProperty()
  movie: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  movieDate: Date;

  @ApiProperty()
  watchedAt: Date;

  @ApiProperty()
  ticketNumber: number;

  @ApiProperty()
  ticket: string;
}
