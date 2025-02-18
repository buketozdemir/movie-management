import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationRequestDto } from '../../../../common/dtos/request';
import { MovieStatus } from '../../movie.enum';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class GetMoviesRequestDto extends IntersectionType(PaginationRequestDto) {
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

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsDate()
  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsOptional()
  releaseDate?: Date;

  @IsDate()
  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsOptional()
  releaseDateLTE?: Date;

  @IsDate()
  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsOptional()
  releaseDateGTE?: Date;

  @IsInt()
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  ageRestriction?: number;

  @IsInt()
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  ageRestrictionLTE?: number;

  @IsInt()
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  ageRestrictionGTE?: number;
}
