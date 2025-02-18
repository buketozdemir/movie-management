import { ApiProperty } from '@nestjs/swagger';

export class GetRoomResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: number;
}
