import { PaginationFilter } from '../../common/interfaces/pagination';
import { TicketStatus } from '../ticket/ticket.enum';
import { MovieStatus } from '../movie/movie.enum';

export interface GetUserMovies extends PaginationFilter {
  name?: string;
  releaseDate?: any;
  releaseDateLTE?: Date;
  releaseDateGTE?: Date;
  ageRestriction?: any;
  ageRestrictionLTE?: number;
  ageRestrictionGTE?: number;
  status?: MovieStatus;
}

export interface GetUserTickets extends PaginationFilter {
  movie?: string;
}

export interface WatchMovie {
  ticketId: string;
}

export interface WatchMovieValidationsParams {
  ticket: WatchMovieTicket;
  movieId: string;
  userId: string;
}

export interface WatchMovieTicket {
  id: string;
  user: string;
  movie: string;
  status: TicketStatus;
  movieDate: Date;
}

export interface GetWatchHistory extends PaginationFilter {
  status: TicketStatus;
  movieName?: string;
}
