import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MovieStatus } from '../../movie.enum';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class PostMovieRequestDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsDate()
  @ApiProperty({ required: true })
  @Type(() => Date)
  releaseDate: Date;

  @IsInt()
  @ApiProperty({ required: true })
  @Type(() => Number)
  ageRestriction: number;

  @IsEnum(MovieStatus)
  @ApiProperty({
    required: false,
    enum: Object.values(MovieStatus).filter((value) => typeof value === 'number'),
    enumName: 'MovieStatus',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const movieStatusValue = Number(value);
    if (!(movieStatusValue in MovieStatus)) {
      throw new BadRequestException(`${movieStatusValue} is not a valid`);
    }
    return movieStatusValue as MovieStatus;
  })
  status?: MovieStatus;

  @IsMongoId()
  createdBy: string;
}
