import { ApiProperty } from '@nestjs/swagger';

export class PostTicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ticketNumber: number;

  @ApiProperty()
  movieDate: Date;

  @ApiProperty()
  status: number;
}
