import { ApiProperty } from '@nestjs/swagger';

export class GetUserTicketResponseDto {
  @ApiProperty()
  id: string;

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
}
