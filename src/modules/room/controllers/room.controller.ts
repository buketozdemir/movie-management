import { Body, Controller, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomService } from '../services/room.service';
import {
  BaseResponseDto,
  BaseErrorResponseDto,
  PaginatedResponseDto,
  ValidationErrorResponseDto,
  BaseDeleteResponseDto,
  BasePatchResponseDto,
} from '../../../common/dtos/response';
import { ApiOkResponseSchema, DeleteMethod, GetMethod, ObjectIdParam, PatchMethod, PostMethod, RateLimiter } from '../../../common/decorators/decorators';
import { GetRoomRequestDto, GetRoomsRequestDto, PatchRoomRequestDto, PostRoomRequestDto } from '../dtos/request';
import { GetRoomResponseDto, PostRoomResponseDto } from '../dtos/response';
import { TokenValidatorGuard } from '../../../common/guards';
import { RequestWithHeader } from '../../../common/interfaces/header';

@ApiTags('room')
@Controller('rooms')
@RateLimiter()
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @GetMethod()
  @ApiOperation({ summary: 'Get rooms' })
  @ApiOkResponseSchema(GetRoomResponseDto, true, true)
  async getRoomsController(@Query() query: GetRoomsRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const { name, status, page, limit, sortOrder, sort, projection } = query;
    const result = await this.roomService.getRooms({
      filter: { name, status },
      page,
      limit,
      sortOrder,
      sort,
      projection,
    });
    return new PaginatedResponseDto(result);
  }

  @GetMethod(':roomId')
  @ApiOperation({ summary: 'Get the room' })
  @ApiOkResponseSchema(GetRoomResponseDto)
  async getRoomController(@ObjectIdParam('roomId') roomId: string, @Query() query: GetRoomRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.roomService.getRoomById(roomId, query);
    return new BaseResponseDto(result);
  }

  @PostMethod()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiOkResponseSchema(PostRoomResponseDto)
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async createRoomController(@Body() payload: PostRoomRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    payload.createdBy = req.user.id;
    const result = await this.roomService.createRoom(payload);
    return new BaseResponseDto(result);
  }

  @PatchMethod(':roomId')
  @ApiOperation({ summary: 'Update the room' })
  @ApiOkResponse({ type: BasePatchResponseDto, description: 'Room Updated Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Room Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async updateRoomController(
    @ObjectIdParam('roomId') roomId: string,
    @Body() payload: PatchRoomRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    payload.updatedBy = req.user.id;
    const result = await this.roomService.updateRoom(roomId, payload);
    return new BaseResponseDto(result);
  }

  @DeleteMethod(':roomId')
  @ApiOperation({ summary: 'Delete the room' })
  @ApiOkResponse({ type: BaseDeleteResponseDto, description: 'Room Deleted Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Room Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async deleteRoomController(@ObjectIdParam('roomId') roomId: string, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.roomService.deleteRoom(roomId);
    return new BaseResponseDto(result);
  }
}
