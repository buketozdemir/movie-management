import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginationDto, SortDto } from '../../../../common/dtos/request';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserMoviesRequestDto extends IntersectionType(PaginationDto, SortDto) {
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
