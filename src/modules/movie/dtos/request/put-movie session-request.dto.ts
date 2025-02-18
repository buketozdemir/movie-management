import { ApiProperty } from '@nestjs/swagger';
import { TimeSlot, UserRole } from '../../../../common/enums';
import { IsDate, IsEnum, IsInt, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { MovieSessionStatus, MovieStatus } from '../../movie.enum';

export class PutMovieSessionRequestDto {
  @IsDate()
  @ApiProperty({ required: true })
  @Type(() => Date)
  startTime: Date;

  @IsEnum(TimeSlot)
  @ApiProperty({
    required: true,
    enum: Object.values(TimeSlot).filter((value) => typeof value === 'number'),
    enumName: 'TimeSlot',
  })
  @Transform(({ value }) => {
    const timeSlotValue = Number(value);
    if (!(timeSlotValue in TimeSlot)) {
      throw new BadRequestException(`${timeSlotValue} is not a valid`);
    }
    return timeSlotValue as TimeSlot;
  })
  timeSlot: TimeSlot;

  @IsMongoId()
  @ApiProperty({ required: true })
  room: string;

  @IsNumber()
  @ApiProperty({ required: true })
  price: number;

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

  @IsMongoId()
  createdBy: string;
}
