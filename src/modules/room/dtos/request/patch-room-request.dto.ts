import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { RoomStatus } from '../../room.enum';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class PatchRoomRequestDto {
  @IsEnum(RoomStatus)
  @ApiProperty({
    required: false,
    enum: Object.values(RoomStatus).filter((value) => typeof value === 'number'),
    enumName: 'RoomStatus',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const roomStatusValue = Number(value);
    if (!(roomStatusValue in RoomStatus)) {
      throw new BadRequestException(`${roomStatusValue} is not a valid`);
    }
    return roomStatusValue as RoomStatus;
  })
  status?: RoomStatus;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  capacity?: number;

  @IsMongoId()
  updatedBy: string;
}
