import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorResponseDto {
  @ApiProperty()
  code: number;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;
}
