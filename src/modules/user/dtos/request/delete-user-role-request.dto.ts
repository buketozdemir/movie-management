import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteUserRoleRequestDto {
  @IsMongoId()
  deletedBy: string;
}
