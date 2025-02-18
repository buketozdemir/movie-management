import { Injectable } from '@nestjs/common';
import { PaginationFilterOptions } from '../../../common/interfaces/pagination';
import { MovieService } from '../../movie/services/movie.service';
import { GetUserMovies, GetUserTickets, GetWatchHistory, WatchMovie } from '../user-movie.interface';
import { MovieStatus } from '../../movie/movie.enum';
import { TicketService } from '../../ticket/services/ticket.service';
import UserMovieLogic from '../logics/user-movie.logic';
import { TicketStatus } from '../../ticket/ticket.enum';
import mongoose from 'mongoose';

@Injectable()
export class UserMovieService {
  private readonly userMovieProjection = 'name ageRestriction releaseDate';
  private readonly userTicketProjection = 'movie status movieDate watchedAt ticketNumber';
  constructor(
    private readonly movieService: MovieService,
    private readonly ticketService: TicketService,
  ) {}

  async getMovies(options: PaginationFilterOptions<GetUserMovies>) {
    const { page, limit, sortOrder, sort, filter } = options;
    return this.movieService.getMovies({
      filter: { status: MovieStatus.Active, ...filter },
      page,
      limit,
      sortOrder,
      sort,
      projection: this.userMovieProjection,
    });
  }

  async getMovie(movieId: string) {
    return this.movieService.getMovieById(movieId, { projection: this.userMovieProjection });
  }

  async getTickets(options: PaginationFilterOptions<GetUserTickets>) {
    const { page, limit, sortOrder, sort, filter } = options;
    return this.ticketService.getTickets({
      filter,
      page,
      limit,
      sortOrder,
      sort,
      projection: this.userTicketProjection,
    });
  }

  async getTicket(ticketId: string) {
    return this.ticketService.getTicketById(ticketId, { projection: this.userTicketProjection });
  }

  async getWatchHistory(userId: string, options: PaginationFilterOptions<GetWatchHistory>) {
    const { page, limit, sortOrder, sort, filter } = options;
    const queryFilter: any = {
      user: new mongoose.Types.ObjectId(userId),
    };
    if (filter.status) queryFilter.status = filter.status;
    const baseProject = {
      $project: {
        movieName: '$movieData.name',
        movieReleaseDate: '$movieData.releaseDate',
        movie: 1,
        status: 1,
        movieDate: 1,
        watchedAt: 1,
        ticketNumber: 1,
        ticket: '$_id',
        _id: 0,
      },
    };
    const pipeline: any = [
      {
        $match: queryFilter,
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movieData',
        },
      },
      {
        $unwind: '$movieData',
      },
    ];

    if (filter.movieName) pipeline.push({ $match: { 'movieData.name': { $regex: filter.movieName, $options: 'i' } } });

    pipeline.push(baseProject);
    return this.ticketService.getTicketsByRawQuery({ pipeline, page, limit, sortOrder, sort });
  }

  async watchMovie(userId: string, movieId: string, payload: WatchMovie) {
    const { ticketId } = payload;
    const ticket = await this.ticketService.getTicketById(ticketId, { projection: 'user movie status movieDate' });
    UserMovieLogic.validateWatch({ ticket, movieId, userId });
    await this.ticketService.updateTicket(ticketId, { status: TicketStatus.Used, watchedAt: new Date(), updatedBy: userId });
    return true;
  }
}
