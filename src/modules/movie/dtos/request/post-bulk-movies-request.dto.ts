import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PostMovieRequestDto } from './post-movie-request.dto';

export class PostBulkMoviesRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostMovieRequestDto)
  @ApiProperty({ required: true, type: [PostMovieRequestDto] })
  movies: PostMovieRequestDto[];
}
