import { ApiProperty } from '@nestjs/swagger';

export class GetUserRolesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  roles: number[];
}
