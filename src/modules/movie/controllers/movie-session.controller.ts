import { Body, Controller, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  BaseResponseDto,
  BaseErrorResponseDto,
  ValidationErrorResponseDto,
  BasePatchResponseDto,
  BaseDeleteResponseDto,
  BasePutResponseDto,
  PaginatedResponseDto,
} from '../../../common/dtos/response';
import { ApiOkResponseSchema, DeleteMethod, GetMethod, ObjectIdParam, PatchMethod, PutMethod, RateLimiter } from '../../../common/decorators/decorators';
import {
  DeleteMovieSessionRequestDto,
  GetMovieSessionRequestDto,
  GetMovieSessionsRequestDto,
  PatchMovieSessionRequestDto,
  PutMovieSessionRequestDto,
} from '../dtos/request';
import { MovieSessionService } from '../services/movie-session.service';
import { GetMovieSessionResponseDto } from '../dtos/response';
import { TokenValidatorGuard } from '../../../common/guards';
import { RequestWithHeader } from '../../../common/interfaces/header';

@ApiTags('movie-session')
@Controller('movies')
@RateLimiter()
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard)
export class MovieSessionController {
  constructor(private readonly movieSessionService: MovieSessionService) {}

  @GetMethod(':movieId/sessions')
  @ApiOperation({ summary: 'Get the movie sessions' })
  @ApiOkResponseSchema(GetMovieSessionResponseDto, true, true)
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Movie Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async getMovieSessionsController(
    @ObjectIdParam('movieId') movieId: string,
    @Query() query: GetMovieSessionsRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.movieSessionService.getSessionsOfMovie(movieId, query);
    return new PaginatedResponseDto(result);
  }

  @GetMethod(':movieId/sessions/:sessionId')
  @ApiOperation({ summary: 'Get the movie sessions' })
  @ApiOkResponseSchema(GetMovieSessionResponseDto)
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Movie Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async getMovieSessionController(
    @ObjectIdParam('movieId') movieId: string,
    @ObjectIdParam('sessionId') sessionId: string,
    @Query() query: GetMovieSessionRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const { projection } = query;
    const result = await this.movieSessionService.getSessionOfMovie(movieId, sessionId, projection);
    return new BaseResponseDto(result);
  }

  @PutMethod(':movieId/sessions')
  @ApiOperation({ summary: 'Add a session to the movie' })
  @ApiOkResponse({ type: BasePutResponseDto, description: 'Session Added Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Movie Not Found Error' })
  @ApiConflictResponse({ type: BaseErrorResponseDto, description: 'Movie Session Already Exists' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async addSessionToMovieController(
    @ObjectIdParam('movieId') movieId: string,
    @Body() payload: PutMovieSessionRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.movieSessionService.addSessionToMovie(movieId, payload);
    return new BaseResponseDto(result);
  }

  @PatchMethod(':movieId/sessions/:sessionId')
  @ApiOperation({ summary: 'Update a session from the movie' })
  @ApiOkResponse({ type: BasePatchResponseDto, description: 'Session Updated Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Movie or Movie Session Not Found Error' })
  @ApiConflictResponse({ type: BaseErrorResponseDto, description: 'Movie Session Already Exists' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async updateSessionFromMovieController(
    @ObjectIdParam('movieId') movieId: string,
    @ObjectIdParam('sessionId') sessionId: string,
    @Body() payload: PatchMovieSessionRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.movieSessionService.updateSessionFromMovie(movieId, sessionId, payload);
    return new BaseResponseDto(result);
  }

  @DeleteMethod(':movieId/sessions/:sessionId')
  @ApiOperation({ summary: 'Delete the session from the movie' })
  @ApiOkResponse({ type: BaseDeleteResponseDto, description: 'Movie Session Deleted Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Movie Not Found Error or Movie Session Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async deleteMovieSessionController(
    @ObjectIdParam('movieId') movieId: string,
    @ObjectIdParam('sessionId') sessionId: string,
    @Body() payload: DeleteMovieSessionRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.movieSessionService.deleteSessionFromMovie(movieId, sessionId, payload, req);
    return new BaseResponseDto(result);
  }
}
