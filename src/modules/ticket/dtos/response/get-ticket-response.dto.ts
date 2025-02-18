import { ApiProperty } from '@nestjs/swagger';

export class GetTicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: string;

  @ApiProperty()
  movie: string;

  @ApiProperty()
  session: string;

  @ApiProperty()
  ticketNumber: number;

  @ApiProperty()
  movieDate: Date;

  @ApiProperty()
  price: number;

  @ApiProperty()
  status: number;
}
