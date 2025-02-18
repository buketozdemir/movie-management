import { IsMongoId } from 'class-validator';

export class DeleteUserRequestDto {
  @IsMongoId()
  deletedBy: string;
}
