import { ApiProperty } from '@nestjs/swagger';

export class GetUserMovieResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ageRestriction: number;

  @ApiProperty()
  releaseDate: Date;
}
