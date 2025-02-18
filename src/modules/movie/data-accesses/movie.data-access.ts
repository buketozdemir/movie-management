import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDataAccess } from '../../../common/data-accesses/base-data-access';
import { PaginatedQueryParams, QueryParams } from '../../../common/interfaces/data-access';
import { Movie, MovieDocument } from '../schemas/movie.schema';
import { PatchMovie, PostMovie } from '../movie.interface';
import { MovieHelper } from '../helper/movie.helper';

@Injectable()
export class MovieDataAccess extends BaseDataAccess<MovieDocument> {
  constructor(@InjectModel(Movie.name) private MovieModel: Model<MovieDocument>) {
    super(MovieModel);
  }

  async getMovie(params: QueryParams): Promise<any> {
    return this.findOne(params);
  }

  async getMovies(params: PaginatedQueryParams): Promise<any> {
    if (params.filter) params.filter = MovieHelper.prepareMovieFilter(params.filter);
    return this.get(params);
  }

  async createMovie(payload: PostMovie): Promise<any> {
    return this.create(payload);
  }

  async createBulkMovie(payload: PostMovie[]): Promise<any> {
    return this.createMany(payload);
  }

  async patchMovie(movieId: string, payload: PatchMovie): Promise<any> {
    return this.updateOne({ _id: movieId }, payload);
  }

  async deleteMovie(movieId: string): Promise<any> {
    return this.deleteOne({ _id: movieId });
  }
}
