import { ApiProperty } from '@nestjs/swagger';
import { TimeSlot, UserRole } from '../../../../common/enums';
import { IsDate, IsEnum, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { MovieSessionStatus } from '../../movie.enum';

export class PatchMovieSessionRequestDto {
  @IsDate()
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  startTime?: Date;

  @IsEnum(TimeSlot)
  @IsOptional()
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
  timeSlot?: TimeSlot;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  price?: number;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({ required: false })
  room?: string;

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
  updatedBy: string;
}
