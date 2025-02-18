import { ApiProperty } from '@nestjs/swagger';

export class PostRoomResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: number;
}
