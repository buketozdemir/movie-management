import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PatchUserRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  lastName?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  status?: number;

  @IsMongoId()
  updatedBy: string;
}
