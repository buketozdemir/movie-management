import { Injectable, Logger } from '@nestjs/common';
import {
  MovieSessionAlreadyStartedException,
  TicketAlreadyUsedException,
  TicketCancelledException,
  TicketExpiredException,
  TicketNotFoundException,
  UserPermissionDeniedException,
} from '../../../common/errors';
import { WatchMovieValidationsParams } from '../user-movie.interface';
import { TicketStatus } from '../../ticket/ticket.enum';

@Injectable()
class UserMovieLogic {
  logger = new Logger(UserMovieLogic.name);

  static validateWatch(params: WatchMovieValidationsParams) {
    const { ticket, userId, movieId } = params;
    if (!ticket) throw new TicketNotFoundException();

    const { movieDate, movie, user, status } = ticket;

    this.checkTicketStatus(status);

    if (movieDate.getTime() < new Date().getTime()) throw new MovieSessionAlreadyStartedException();
    if (userId !== user.toString()) throw new UserPermissionDeniedException();
    if (movieId !== movie.toString()) throw new UserPermissionDeniedException();
  }

  private static checkTicketStatus(status: TicketStatus) {
    switch (status) {
      case TicketStatus.Cancelled:
        throw new TicketCancelledException();
      case TicketStatus.Used:
        throw new TicketAlreadyUsedException();
      case TicketStatus.Expired:
        throw new TicketExpiredException();
    }
  }
}

export default UserMovieLogic;
