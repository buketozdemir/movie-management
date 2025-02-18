import { ApiProperty } from '@nestjs/swagger';

export class BaseDeleteResponseDto {
  @ApiProperty({ default: true })
  data: boolean;

  @ApiProperty({ default: [] })
  actions: any[];

  @ApiProperty({ default: 'success' })
  message: string;
}
