import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginationDto, SortDto } from '../../../../common/dtos/request';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TicketStatus } from '../../../ticket/ticket.enum';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class GetWatchHistoryRequestDto extends IntersectionType(PaginationDto, SortDto) {
  @IsEnum(TicketStatus)
  @ApiProperty({
    required: false,
    enum: Object.values(TicketStatus).filter((value) => typeof value === 'number'),
    enumName: 'TicketStatus',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const ticketStatusValue = Number(value);
    if (!(ticketStatusValue in TicketStatus)) {
      throw new BadRequestException(`${ticketStatusValue} is not a valid`);
    }
    return ticketStatusValue as TicketStatus;
  })
  status?: TicketStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  movieName?: string;
}
