import { ApiProperty } from '@nestjs/swagger';

export class BasePostResponseDto {
  @ApiProperty({ default: true })
  data: boolean;

  @ApiProperty({ default: [] })
  actions: any[];

  @ApiProperty({ default: 'success' })
  message: string;
}
