import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gsmCountryCode: string;

  @ApiProperty()
  gsm: string;

  @ApiProperty()
  status: number;
}
