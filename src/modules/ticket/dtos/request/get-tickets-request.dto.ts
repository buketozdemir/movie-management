import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from '../../../../common/dtos/request';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { TicketStatus } from '../../ticket.enum';

export class GetTicketsRequestDto extends IntersectionType(PaginationRequestDto) {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsMongoId()
  user?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsMongoId()
  movie?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsMongoId()
  session?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  ticketNumber?: number;

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
}
