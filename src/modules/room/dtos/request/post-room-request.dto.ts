import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { RoomStatus } from '../../room.enum';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class PostRoomRequestDto {
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
  @ApiProperty({ required: true })
  name: string;

  @IsInt()
  @ApiProperty({ required: true })
  capacity: number;

  @IsMongoId()
  createdBy: string;
}
