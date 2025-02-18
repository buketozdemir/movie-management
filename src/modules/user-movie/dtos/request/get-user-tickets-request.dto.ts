import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginationDto, SortDto } from '../../../../common/dtos/request';
import { IsDate, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserTicketsRequestDto extends IntersectionType(PaginationDto, SortDto) {
  @IsMongoId()
  @IsOptional()
  @ApiProperty({ required: false })
  movie?: string;
}
