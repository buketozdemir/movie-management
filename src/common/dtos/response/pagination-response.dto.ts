import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  constructor(result: any, message: string = 'success') {
    super(result.data, result.actions, message);
    this.totalCount = result.totalCount;
    this.page = result.page;
    this.limit = result.limit;
  }
}
