import { ApiProperty } from '@nestjs/swagger';

export class GetMovieResponseDto {
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
