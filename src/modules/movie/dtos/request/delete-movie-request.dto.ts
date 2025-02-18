import { IsMongoId } from 'class-validator';

export class DeleteMovieRequestDto {
  @IsMongoId()
  deletedBy: string;
}
