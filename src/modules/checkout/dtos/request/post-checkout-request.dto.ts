import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class PostCheckoutRequestDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  movieId: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  sessionId: string;
}
