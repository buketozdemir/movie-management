import { PaginationFilter } from '../../common/interfaces/pagination';

export interface GetMovies extends PaginationFilter {
  name?: string;
  releaseDate?: any;
  releaseDateLTE?: Date;
  releaseDateGTE?: Date;
  ageRestriction?: any;
  ageRestrictionLTE?: number;
  ageRestrictionGTE?: number;
  status?: number;
}

export interface PostMovie {
  name: string;
  releaseDate: Date;
  ageRestriction: number;
  status?: number;
  createdBy: string;
}

export interface PostBulkMovies {
  movies: PostMovie[];
}

export interface PatchMovie {
  name?: string;
  releaseDate?: Date;
  ageRestriction?: number;
  status?: number;
  updatedBy: string;
  deletedBy?: string;
}

export interface GetMovieSessions extends PaginationFilter {
  startTime?: any;
  startTimeLTE?: Date;
  startTimeGTE?: Date;
  timeSlot?: any;
  room?: any;
  status?: any;
}

export interface PutMovieSession {
  startTime: Date;
  timeSlot: number;
  room: string;
  price: number;
  status?: number;
  createdBy: string;
}

export interface PatchMovieSession {
  startTime?: Date;
  timeSlot?: number;
  room?: string;
  price?: number;
  status?: number;
  updatedBy: string;
}

export interface DeleteMovie {
  deletedBy: string;
}

export interface CheckMovieParams {
  movieId?: string;
  name?: string;
  projection?: string;
  mustExist: boolean;
}
