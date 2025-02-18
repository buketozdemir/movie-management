import { Injectable } from '@nestjs/common';
import { CheckoutParams } from '../checkout.interface';
import { TicketService } from '../../ticket/services/ticket.service';
import { MovieService } from '../../movie/services/movie.service';
import { UserService } from '../../user/services/user.service';
import { MovieSessionService } from '../../movie/services/movie-session.service';
import { TicketStatus } from '../../ticket/ticket.enum';
import { RoomService } from '../../room/services/room.service';
import CheckoutLogic from '../logics/checkout.logic';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly userService: UserService,
    private readonly ticketService: TicketService,
    private readonly movieService: MovieService,
    private readonly movieSessionService: MovieSessionService,
    private readonly roomService: RoomService,
  ) {}

  async checkout(params: CheckoutParams) {
    const { movieId, sessionId, userId } = params;

    const [user, movie, session, { totalCount: ticketCount }] = await Promise.all([
      this.userService.getUserById(userId, { projection: 'birthDate' }),
      this.movieService.getMovieById(movieId, { projection: 'status ageRestriction' }),
      this.movieSessionService.getSessionOfMovie(movieId, sessionId, 'status startTime price room'),
      this.ticketService.getTickets({ filter: { session: sessionId, status: TicketStatus.Open }, page: 1, limit: 1 }),
    ]);
    const { capacity: roomCapacity } = await this.roomService.getRoomById(session.room, {
      projection: 'capacity',
    });

    CheckoutLogic.validateCheckout({ user, movie, session, roomCapacity, ticketCount });
    await this.ticketService.createTicket({
      movie: movieId,
      movieDate: session.startTime,
      price: session.price,
      session: sessionId,
      user: userId,
      createdBy: userId,
    });
    return true;
  }
}
