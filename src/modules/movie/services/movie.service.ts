import { Injectable } from '@nestjs/common';
import { MovieDataAccess } from '../data-accesses/movie.data-access';
import { PaginationFilterOptions } from '../../../common/interfaces/pagination';
import { CheckMovieParams, DeleteMovie, GetMovies, PatchMovie, PostBulkMovies, PostMovie } from '../movie.interface';
import { QueryParams } from '../../../common/interfaces/data-access';
import { MovieStatus } from '../movie.enum';
import { MovieAlreadyExistsException, MovieNotFoundException } from '../../../common/errors';

@Injectable()
export class MovieService {
  constructor(private readonly movieDataAccess: MovieDataAccess) {}

  async getMovies(options: PaginationFilterOptions<GetMovies>) {
    return this.movieDataAccess.getMovies(options);
  }

  async getMovie(options: QueryParams) {
    return this.movieDataAccess.getMovie(options);
  }

  async getMovieById(movieId: string, options: QueryParams) {
    options.filter = { _id: movieId };
    return this.movieDataAccess.getMovie(options);
  }

  async createMovie(payload: PostMovie) {
    payload.status = payload.status || MovieStatus.Active;
    const { name } = payload;
    await this.checkMovieExistence({ name, mustExist: false });
    payload.status = payload.status || MovieStatus.Active;
    const movie = await this.movieDataAccess.createMovie(payload);
    return { id: movie._id, name: movie.name, ageRestriction: movie.ageRestriction, releaseDate: movie.releaseDate, status: movie.status };
  }

  async createBulkMovie(payload: PostBulkMovies) {
    const { movies } = payload;
    const results = await Promise.all(
      movies.map(async (item: any) => {
        item.status = item.status || MovieStatus.Active;
        await this.checkMovieExistence({ name: item.name, mustExist: false });
        return item;
      }),
    );
    await this.movieDataAccess.createBulkMovie(results);
    return true;
  }

  async updateMovie(movieId: string, payload: PatchMovie) {
    await this.checkMovieExistence({ movieId, mustExist: true });
    await this.movieDataAccess.patchMovie(movieId, payload);
    return true;
  }

  async deleteMovie(movieId: string, payload: DeleteMovie) {
    await this.checkMovieExistence({ movieId, mustExist: true });
    const { deletedBy } = payload;
    await this.movieDataAccess.patchMovie(movieId, { status: MovieStatus.Deleted, updatedBy: deletedBy, deletedBy });
    return true;
  }

  async deleteBulkMovie(movieIds: string[], payload: DeleteMovie) {
    await Promise.all(
      movieIds.map(async (movieId: string) => {
        await this.checkMovieExistence({ movieId, mustExist: true });
        const { deletedBy } = payload;
        await this.movieDataAccess.patchMovie(movieId, { status: MovieStatus.Deleted, updatedBy: deletedBy, deletedBy });
      }),
    );
    return true;
  }

  async checkMovieExistence(params: CheckMovieParams) {
    const { movieId, name, mustExist, projection } = params;
    let movie: any = {};
    if (movieId) {
      movie = await this.movieDataAccess.getMovie({ filter: { _id: movieId }, projection });
    } else if (name) {
      movie = await this.movieDataAccess.getMovie({ filter: { name }, projection });
    }
    if (mustExist) {
      if (!movie) {
        throw new MovieNotFoundException();
      }
    } else {
      if (movie) {
        throw new MovieAlreadyExistsException();
      }
    }
    return movie;
  }
}
