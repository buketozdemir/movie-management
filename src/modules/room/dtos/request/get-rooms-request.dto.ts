import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from '../../../../common/dtos/request';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RoomStatus } from '../../room.enum';

export class GetRoomsRequestDto extends IntersectionType(PaginationRequestDto) {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  name?: string;

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
}
