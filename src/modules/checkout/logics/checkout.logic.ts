import { Injectable, Logger } from '@nestjs/common';
import { CheckoutValidationsParams } from '../checkout.interface';
import {
  AgeRestrictionException,
  MovieNotActiveException,
  MovieNotFoundException,
  MovieSessionAlreadyStartedException,
  MovieSessionNotActiveException,
  MovieSessionNotFoundException,
  RoomCapacityIsFullException,
  UserNotFoundException,
} from '../../../common/errors';
import { MovieSessionStatus, MovieStatus } from '../../movie/movie.enum';
import { getAge } from '../../../common/utils';

@Injectable()
class CheckoutLogic {
  logger = new Logger(CheckoutLogic.name);

  static validateCheckout(params: CheckoutValidationsParams) {
    const { movie, session, user, roomCapacity, ticketCount } = params;
    if (!movie) throw new MovieNotFoundException();
    if (!session) throw new MovieSessionNotFoundException();
    if (!user) throw new UserNotFoundException();

    const { status: movieStatus, ageRestriction } = movie;
    const { status: sessionStatus, startTime } = session;
    const { birthDate } = user;

    if (movieStatus !== MovieStatus.Active) throw new MovieNotActiveException();
    if (sessionStatus !== MovieSessionStatus.Active) throw new MovieSessionNotActiveException();
    if (startTime.getTime() < new Date().getTime()) throw new MovieSessionAlreadyStartedException();
    if (ageRestriction > getAge(birthDate)) throw new AgeRestrictionException();
    if (roomCapacity <= ticketCount) throw new RoomCapacityIsFullException();
  }
}

export default CheckoutLogic;
