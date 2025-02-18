import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION } from '../../constants';

export class PaginationRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  projection?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sort?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @IsEnum([-1, 1])
  @ApiProperty({
    required: false,
    enum: [-1, 1],
    default: 1,
    description: '1 => Sort ascending, -1 => Sort descending',
  })
  @Allow(null)
  sortOrder?: number;

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
