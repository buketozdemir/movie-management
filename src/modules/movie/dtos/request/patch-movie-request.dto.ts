import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MovieStatus } from '../../movie.enum';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class PatchMovieRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Date)
  releaseDate?: Date;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Number)
  ageRestriction?: number;

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
  updatedBy: string;
}
