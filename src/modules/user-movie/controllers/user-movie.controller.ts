import { Body, Controller, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserMovieService } from '../services/user-movie.service';
import { BaseResponseDto, PaginatedResponseDto } from '../../../common/dtos/response';
import { ApiOkResponseSchema, GetMethod, ObjectIdParam, PostMethod, RateLimiter } from '../../../common/decorators/decorators';
import { GetUserMoviesRequestDto, GetUserTicketsRequestDto, GetWatchHistoryRequestDto, WatchMovieRequestDto } from '../dtos/request';
import { GetUserMovieResponseDto, GetUserTicketResponseDto, GetUserWatchHistoryResponseDto } from '../dtos/response';
import { TokenValidatorGuard, UserOwnValidatorGuard } from '../../../common/guards';
import { RequestWithHeader } from '../../../common/interfaces/header';

@ApiTags('user-movie')
@Controller('users')
@RateLimiter()
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard, UserOwnValidatorGuard)
export class UserMovieController {
  constructor(private readonly userMovieService: UserMovieService) {}

  @GetMethod(':userId/movies')
  @ApiOperation({ summary: 'Get movies' })
  @ApiOkResponseSchema(GetUserMovieResponseDto, true, true)
  async getMoviesController(
    @ObjectIdParam('userId') userId: string,
    @Query() query: GetUserMoviesRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const { ageRestrictionGTE, ageRestrictionLTE, ageRestriction, releaseDate, releaseDateGTE, releaseDateLTE, name, page, limit, sortOrder, sort } = query;
    const result = await this.userMovieService.getMovies({
      filter: { ageRestrictionGTE, ageRestrictionLTE, ageRestriction, releaseDate, releaseDateGTE, releaseDateLTE, name },
      page,
      limit,
      sortOrder,
      sort,
    });
    return new PaginatedResponseDto(result);
  }

  @GetMethod(':userId/movies/:movieId')
  @ApiOperation({ summary: 'Get the movie' })
  @ApiOkResponseSchema(GetUserMovieResponseDto)
  async getMovieController(
    @ObjectIdParam('userId') userId: string,
    @ObjectIdParam('movieId') movieId: string,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userMovieService.getMovie(movieId);
    return new BaseResponseDto(result);
  }

  @GetMethod(':userId/tickets')
  @ApiOperation({ summary: 'Get tickets' })
  @ApiOkResponseSchema(GetUserTicketResponseDto, true, true)
  async getTicketsController(
    @ObjectIdParam('userId') userId: string,
    @Query() query: GetUserTicketsRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const { movie, page, limit, sortOrder, sort } = query;
    const result = await this.userMovieService.getTickets({
      filter: { movie },
      page,
      limit,
      sortOrder,
      sort,
    });
    return new PaginatedResponseDto(result);
  }

  @GetMethod(':userId/tickets/:ticketId')
  @ApiOperation({ summary: 'Get the ticket' })
  @ApiOkResponseSchema(GetUserTicketResponseDto)
  async getTicketController(
    @ObjectIdParam('userId') userId: string,
    @ObjectIdParam('ticketId') ticketId: string,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userMovieService.getTicket(ticketId);
    return new BaseResponseDto(result);
  }

  @GetMethod(':userId/watch-history')
  @ApiOperation({ summary: 'Get the movie' })
  @ApiOkResponseSchema(GetUserWatchHistoryResponseDto, true, true)
  async getWatchHistoryController(
    @ObjectIdParam('userId') userId: string,
    @Query() query: GetWatchHistoryRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const { page, limit, sortOrder, sort, movieName, status } = query;
    const result = await this.userMovieService.getWatchHistory(userId, { page, limit, sortOrder, sort, filter: { movieName, status } });
    return new PaginatedResponseDto(result);
  }

  @PostMethod(':userId/movies/:movieId/watch')
  @ApiOperation({ summary: 'Watch the movie' })
  @ApiOkResponseSchema(GetUserMovieResponseDto)
  async watchMovieController(
    @ObjectIdParam('userId') userId: string,
    @ObjectIdParam('movieId') movieId: string,
    @Body() payload: WatchMovieRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userMovieService.watchMovie(userId, movieId, payload);
    return new BaseResponseDto(result);
  }
}
