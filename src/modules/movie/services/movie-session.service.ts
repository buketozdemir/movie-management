import { Injectable } from '@nestjs/common';
import { MovieSessionAlreadyExistsException, MovieSessionNotFoundException } from '../../../common/errors';
import { MetaParam } from '../../../common/interfaces/header';
import { MovieService } from './movie.service';
import { DeletedBy } from '../../../common/interfaces';
import { MovieSessionDataAccess } from '../data-accesses/movie-session.data-access';
import { GetMovieSessions, PatchMovieSession, PutMovieSession } from '../movie.interface';
import MovieSessionLogic from '../logics/movie-session.logic';
import { MovieSessionStatus } from '../movie.enum';

@Injectable()
export class MovieSessionService {
  constructor(
    private readonly movieSessionDataAccess: MovieSessionDataAccess,
    private readonly movieService: MovieService,
  ) {}

  async getSessionsOfMovie(movieId: string, params: GetMovieSessions) {
    await this.movieService.checkMovieExistence({ movieId, mustExist: true });
    return this.movieSessionDataAccess.getSessionsOfMovie(movieId, params);
  }

  async getSessionOfMovie(movieId: string, sessionId: string, projection: string) {
    await this.movieService.checkMovieExistence({ movieId, mustExist: true });
    const movie = await this.movieSessionDataAccess.getSessionsOfMovie(movieId, { projection }, sessionId);
    return movie?.[0] || null;
  }

  async addSessionToMovie(movieId: string, payload: PutMovieSession, headers: MetaParam = {}) {
    const movie = await this.movieService.checkMovieExistence({ movieId, mustExist: true, projection: 'sessions' });
    const isSessionValid = MovieSessionLogic.isMovieSessionValid(payload, movie.sessions);
    if (!isSessionValid) {
      throw new MovieSessionAlreadyExistsException();
    }

    await this.movieSessionDataAccess.addSessionToMovie(movieId, payload);
    return true;
  }

  async updateSessionFromMovie(movieId: string, sessionId: string, payload: PatchMovieSession, headers: MetaParam = {}) {
    const movie = await this.movieService.checkMovieExistence({ movieId, mustExist: true, projection: 'sessions' });
    const session = movie?.sessions?.find((session: any) => session._id.toString() === sessionId);
    if (!session) {
      throw new MovieSessionNotFoundException();
    }
    const { status } = payload;
    if (session.status !== status && status === MovieSessionStatus.Active) {
      const sessionData: any = { status };
      sessionData.startTime = payload.startTime || session.startTime;
      sessionData.timeSlot = payload.timeSlot || session.timeSlot;
      sessionData.room = payload.room || session.room;
      const isSessionValid = MovieSessionLogic.isMovieSessionValid(sessionData, movie.sessions, sessionId);
      if (!isSessionValid) {
        throw new MovieSessionAlreadyExistsException();
      }
    }
    await this.movieSessionDataAccess.updateSessionFromMovie(movieId, sessionId, payload);
    return true;
  }

  async deleteSessionFromMovie(movieId: string, sessionId: string, payload: DeletedBy, headers: MetaParam = {}) {
    const movie = await this.movieService.checkMovieExistence({ movieId, mustExist: true });
    const session = movie?.sessions?.find((session: any) => session._id.toString() === sessionId);
    if (!session) {
      throw new MovieSessionNotFoundException();
    }
    await this.movieSessionDataAccess.updateSessionFromMovie(movieId, sessionId, { status: MovieSessionStatus.Deleted, updatedBy: payload.deletedBy });
    return true;
  }
}
