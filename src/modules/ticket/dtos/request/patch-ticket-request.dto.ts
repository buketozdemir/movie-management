import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsInt, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../../ticket.enum';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class PatchTicketRequestDto {
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

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  price?: number;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Date)
  movieDate?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Date)
  watchedAt?: Date;

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

  @IsMongoId()
  updatedBy: string;
}
