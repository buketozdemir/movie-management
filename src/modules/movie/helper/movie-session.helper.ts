import { Injectable } from '@nestjs/common';
import { GetMovies, GetMovieSessions } from '../movie.interface';

@Injectable()
export class MovieSessionHelper {
  static prepareMovieSessionFilter(filter: GetMovieSessions) {
    const preparedFilter: any = {};
    if (filter.startTimeGTE && filter.startTimeLTE) {
      preparedFilter.startTime = { $gte: filter.startTimeGTE, $lte: filter.startTimeLTE };
    } else if (filter.startTimeLTE) {
      preparedFilter.startTime = { $lte: filter.startTimeLTE };
    } else if (filter.startTimeGTE) {
      preparedFilter.startTime = { $gte: filter.startTimeGTE };
    } else if (filter.startTime) {
      preparedFilter.startTime = { $eq: filter.startTime };
    }

    if (filter.timeSlot) {
      preparedFilter.timeSlot = { $eq: filter.timeSlot };
    }

    if (filter.room) {
      preparedFilter.room = { $eq: filter.room };
    }

    if (filter.status) {
      preparedFilter.status = { $eq: filter.status };
    }

    return preparedFilter;
  }
}
