import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SortDto {
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
}
