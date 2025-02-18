import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION } from '../../constants';

export class PaginationDto {
  @IsInt()
  @ApiProperty({ required: true, default: PAGINATION.DEFAULT_PAGE })
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @ApiProperty({ required: true, default: PAGINATION.DEFAULT_LIMIT })
  @Min(1)
  @Max(250)
  @Type(() => Number)
  limit: number;
}
