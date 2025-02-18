import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class DeleteBulkMoviesRequestDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({ required: true, type: [String] })
  movieIds: string[];

  @IsMongoId()
  deletedBy: string;
}
