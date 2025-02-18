import { Body, Controller, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovieService } from '../services/movie.service';
import {
  BaseResponseDto,
  BaseErrorResponseDto,
  PaginatedResponseDto,
  ValidationErrorResponseDto,
  BasePatchResponseDto,
  BaseDeleteResponseDto,
  BasePostResponseDto,
} from '../../../common/dtos/response';
import { ApiOkResponseSchema, DeleteMethod, GetMethod, ObjectIdParam, PatchMethod, PostMethod, RateLimiter } from '../../../common/decorators/decorators';
import { TokenValidatorGuard } from '../../../common/guards';
import {
  DeleteBulkMoviesRequestDto,
  DeleteMovieRequestDto,
  GetMovieRequestDto,
  GetMoviesRequestDto,
  PatchMovieRequestDto,
  PostBulkMoviesRequestDto,
  PostMovieRequestDto,
} from '../dtos/request';
import { GetMovieResponseDto, PostMovieResponseDto } from '../dtos/response';
import { RequestWithHeader } from '../../../common/interfaces/header';

@ApiTags('movie')
@Controller('movies')
@RateLimiter()
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @GetMethod()
  @ApiOperation({ summary: 'Get movies' })
  @ApiOkResponseSchema(GetMovieResponseDto, true, true)
  async getMoviesController(@Query() query: GetMoviesRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const {
      status,
      ageRestrictionGTE,
      ageRestrictionLTE,
      ageRestriction,
      releaseDateGTE,
      releaseDateLTE,
      releaseDate,
      name,
      page,
      limit,
      sortOrder,
      sort,
      projection,
    } = query;
    const result = await this.movieService.getMovies({
      filter: { status, ageRestrictionGTE, ageRestrictionLTE, ageRestriction, releaseDateGTE, releaseDateLTE, releaseDate, name },
      page,
      limit,
      sortOrder,
      sort,
      projection,
    });
    return new PaginatedResponseDto(result);
  }

  @GetMethod(':movieId')
  @ApiOperation({ summary: 'Get the movie' })
  @ApiOkResponseSchema(GetMovieResponseDto)
  async getMovieController(
    @ObjectIdParam('movieId') movieId: string,
    @Query() query: GetMovieRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.movieService.getMovieById(movieId, query);
    return new BaseResponseDto(result);
  }

  @PostMethod()
  @ApiOperation({ summary: 'Create an movie' })
  @ApiOkResponseSchema(PostMovieResponseDto)
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async createMovieController(@Body() payload: PostMovieRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.movieService.createMovie(payload);
    return new BaseResponseDto(result);
  }

  @PostMethod('bulk')
  @ApiOperation({ summary: 'Create multiple movies' })
  @ApiOkResponse({ type: BasePostResponseDto, description: 'Movies Created Successfully' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async createBulkMovieController(@Body() payload: PostBulkMoviesRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.movieService.createBulkMovie(payload);
    return new BaseResponseDto(result);
  }

  @PatchMethod(':movieId')
  @ApiOperation({ summary: 'Update the movie' })
  @ApiOkResponse({ type: BasePatchResponseDto, description: 'Movie Updated Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Movie Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async updateMovieController(
    @ObjectIdParam('movieId') movieId: string,
    @Body() payload: PatchMovieRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.movieService.updateMovie(movieId, payload);
    return new BaseResponseDto(result);
  }

  @DeleteMethod('bulk')
  @ApiOperation({ summary: 'Delete multiple movies' })
  @ApiOkResponse({ type: BaseDeleteResponseDto, description: 'Movies Deleted Successfully' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async deleteBulkMovieController(@Body() payload: DeleteBulkMoviesRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const { movieIds, deletedBy } = payload;
    const result = await this.movieService.deleteBulkMovie(movieIds, { deletedBy });
    return new BaseResponseDto(result);
  }

  @DeleteMethod(':movieId')
  @ApiOperation({ summary: 'Delete the movie' })
  @ApiOkResponse({ type: BaseDeleteResponseDto, description: 'Movie Deleted Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'Movie Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async deleteMovieController(
    @ObjectIdParam('movieId') movieId: string,
    @Body() payload: DeleteMovieRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.movieService.deleteMovie(movieId, payload);
    return new BaseResponseDto(result);
  }
}
