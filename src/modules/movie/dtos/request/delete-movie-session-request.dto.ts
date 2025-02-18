import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteMovieSessionRequestDto {
  @IsMongoId()
  deletedBy: string;
}
