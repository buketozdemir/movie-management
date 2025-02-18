import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Movie, MovieDocument } from '../schemas/movie.schema';
import { BaseDataAccess } from '../../../common/data-accesses/base-data-access';
import { GetMovieSessions, PatchMovieSession, PutMovieSession } from '../movie.interface';
import { MovieSessionHelper } from '../helper/movie-session.helper';

@Injectable()
export class MovieSessionDataAccess extends BaseDataAccess<MovieDocument> {
  constructor(@InjectModel(Movie.name) private MovieModel: mongoose.Model<MovieDocument>) {
    super(MovieModel);
  }

  async getSessionsOfMovie(movieId: string, params: GetMovieSessions, sessionId?: string) {
    const { page, limit, projection, sortOrder, sort } = params;

    const pipeline: any = [
      {
        $match: { _id: new mongoose.Types.ObjectId(movieId) },
      },
    ];

    pipeline.push(
      {
        $project: {
          sessions: 1,
        },
      },
      { $unwind: '$sessions' },
    );
    if (sessionId)
      pipeline.push({
        $match: { 'sessions._id': new mongoose.Types.ObjectId(sessionId) },
      });
    const preparedFilter = MovieSessionHelper.prepareMovieSessionFilter(params);
    if (Object.keys(preparedFilter).length) pipeline.push(this.prepareFilter(preparedFilter));

    pipeline.push({
      $project: {
        id: '$sessions._id',
        status: '$sessions.status',
        startTime: '$sessions.startTime',
        timeSlot: '$sessions.timeSlot',
        room: '$sessions.room',
        _id: 0,
      },
    });
    return this.aggregate({ pipeline, page, limit, sort, sortOrder, projection });
  }

  async getMovieSessionById(userId: string, sessionId: string) {
    return this.aggregate({
      pipeline: [
        {
          $match: { _id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $project: {
            sessions: 1,
          },
        },
        { $unwind: '$sessions' },
        {
          $match: { 'sessions._id': new mongoose.Types.ObjectId(sessionId) },
        },
        { $replaceRoot: { newRoot: '$sessions' } },
        {
          $project: {
            id: '$_id',
            status: 1,
            startTime: 1,
            timeSlot: 1,
            room: 1,
            _id: 0,
          },
        },
      ],
    });
  }

  async addSessionToMovie(movieId: string, payload: PutMovieSession) {
    await this.updateOne({ _id: movieId }, { $push: { sessions: payload } });
    return true;
  }

  async updateSessionFromMovie(movieId: string, sessionId: string, payload: PatchMovieSession) {
    await this.updateOne(
      { _id: movieId, 'sessions._id': sessionId },
      { $set: this.prepareUpdateArrayItem({ fieldName: 'sessions', payload, filterName: 'item' }) },
      { arrayFilters: [{ 'item._id': sessionId }] },
    );
    return true;
  }

  async deleteSessionFromMovie(movieId: string, sessionId: string) {
    await this.updateOne({ _id: movieId }, { $pull: { sessions: { _id: sessionId } } });
    return true;
  }
}
