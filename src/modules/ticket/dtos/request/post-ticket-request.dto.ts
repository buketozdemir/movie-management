import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../../ticket.enum';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class PostTicketRequestDto {
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

  @ApiProperty({ required: true })
  @IsMongoId()
  user: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  movie: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  session: string;

  @IsMongoId()
  createdBy: string;
}
