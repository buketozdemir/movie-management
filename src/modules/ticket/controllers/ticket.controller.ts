import { Body, Controller, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketService } from '../services/ticket.service';
import {
  BaseResponseDto,
  BaseErrorResponseDto,
  PaginatedResponseDto,
  ValidationErrorResponseDto,
  BaseDeleteResponseDto,
  BasePatchResponseDto,
} from '../../../common/dtos/response';
import { ApiOkResponseSchema, DeleteMethod, GetMethod, ObjectIdParam, PatchMethod, PostMethod, RateLimiter } from '../../../common/decorators/decorators';
import { GetTicketRequestDto, GetTicketsRequestDto, PatchTicketRequestDto, PostTicketRequestDto } from '../dtos/request';
import { GetTicketResponseDto, PostTicketResponseDto } from '../dtos/response';
import { TokenValidatorGuard } from '../../../common/guards';
import { RequestWithHeader } from '../../../common/interfaces/header';

@ApiTags('ticket')
@Controller('tickets')
@RateLimiter()
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @GetMethod()
  @ApiOperation({ summary: 'Get tickets' })
  @ApiOkResponseSchema(GetTicketResponseDto, true, true)
  async getTicketsController(@Query() query: GetTicketsRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const { ticketNumber, session, user, movie, status, page, limit, sortOrder, sort, projection } = query;
    const result = await this.ticketService.getTickets({
      filter: { ticketNumber, session, user, movie, status },
      page,
      limit,
      sortOrder,
      sort,
      projection,
    });
    return new PaginatedResponseDto(result);
  }

  @GetMethod(':ticketId')
  @ApiOperation({ summary: 'Get the ticket' })
  @ApiOkResponseSchema(GetTicketResponseDto)
  async getTicketController(
    @ObjectIdParam('ticketId') ticketId: string,
    @Query() query: GetTicketRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.ticketService.getTicketById(ticketId, query);
    return new BaseResponseDto(result);
  }

  @PostMethod()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiOkResponseSchema(PostTicketResponseDto)
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async createTicketController(@Body() payload: PostTicketRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    payload.createdBy = req.user.id;
    const result = await this.ticketService.createTicket(payload);
    return new BaseResponseDto(result);
  }

  @PatchMethod(':ticketId')
  @ApiOperation({ summary: 'Update the ticket' })
  @ApiOkResponse({ type: BasePatchResponseDto, description: 'Ticket Updated Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Ticket Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async updateTicketController(
    @ObjectIdParam('ticketId') ticketId: string,
    @Body() payload: PatchTicketRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    payload.updatedBy = req.user.id;
    const result = await this.ticketService.updateTicket(ticketId, payload);
    return new BaseResponseDto(result);
  }

  @DeleteMethod(':ticketId')
  @ApiOperation({ summary: 'Delete the ticket' })
  @ApiOkResponse({ type: BaseDeleteResponseDto, description: 'Ticket Deleted Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Ticket Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async deleteTicketController(@ObjectIdParam('ticketId') ticketId: string, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.ticketService.deleteTicket(ticketId);
    return new BaseResponseDto(result);
  }
}
