import { ApiProperty } from '@nestjs/swagger';

export class PostMovieResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ageRestriction: number;

  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  status: number;
}
