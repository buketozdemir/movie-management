import { Injectable, Logger } from '@nestjs/common';
import { PatchMovieSession, PutMovieSession } from '../movie.interface';
import { MovieSessionStatus } from '../movie.enum';

@Injectable()
class MovieSessionLogic {
  logger = new Logger(MovieSessionLogic.name);

  static isMovieSessionValid(payload: PutMovieSession | PatchMovieSession, sessions: any, sessionId?: string) {
    const { startTime, timeSlot, room } = payload;
    return (
      sessions?.filter(
        (session: any) =>
          session.startTime.getTime() === startTime.getTime() &&
          session.status === MovieSessionStatus.Active &&
          session.room.toString() === room.toString() &&
          session.timeSlot === timeSlot &&
          (!sessionId || session._id.toString() !== sessionId),
      )?.length === 0
    );
  }
}

export default MovieSessionLogic;
