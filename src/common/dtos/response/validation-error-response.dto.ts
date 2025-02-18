import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorResponseDto {
  @ApiProperty()
  code: number;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: any[];
}
