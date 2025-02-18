import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationRequestDto } from '../../../../common/dtos/request';
import { MovieSessionStatus } from '../../movie.enum';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { TimeSlot } from '../../../../common/enums';

export class GetMovieSessionsRequestDto extends IntersectionType(PaginationRequestDto) {
  @IsEnum(MovieSessionStatus)
  @ApiProperty({
    required: false,
    enum: Object.values(MovieSessionStatus).filter((value) => typeof value === 'number'),
    enumName: 'MovieSessionStatus',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const movieSessionStatusValue = Number(value);
    if (!(movieSessionStatusValue in MovieSessionStatus)) {
      throw new BadRequestException(`${movieSessionStatusValue} is not a valid`);
    }
    return movieSessionStatusValue as MovieSessionStatus;
  })
  status?: MovieSessionStatus;

  @IsEnum(TimeSlot)
  @ApiProperty({
    required: false,
    enum: Object.values(TimeSlot).filter((value) => typeof value === 'number'),
    enumName: 'TimeSlot',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const timeSlotValue = Number(value);
    if (!(timeSlotValue in TimeSlot)) {
      throw new BadRequestException(`${timeSlotValue} is not a valid`);
    }
    return timeSlotValue as TimeSlot;
  })
  timeSlot?: TimeSlot;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({ required: false })
  room?: string;

  @IsDate()
  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsOptional()
  startTime: Date;

  @IsDate()
  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsOptional()
  startTimeLTE: Date;

  @IsDate()
  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsOptional()
  startTimeGTE: Date;
}
