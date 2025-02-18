import { Injectable } from '@nestjs/common';
import { GetMovies } from '../movie.interface';

@Injectable()
export class MovieHelper {
  static prepareMovieFilter(filter: GetMovies) {
    if (filter.releaseDateLTE && filter.releaseDateGTE) {
      filter.releaseDate = { $gte: filter.releaseDateGTE, $lte: filter.releaseDateLTE };
      delete filter.releaseDateGTE;
      delete filter.releaseDateLTE;
    } else if (filter.releaseDateLTE) {
      filter.releaseDate = { $lte: filter.releaseDateLTE };
      delete filter.releaseDateLTE;
    } else if (filter.releaseDateGTE) {
      filter.releaseDate = { $gte: filter.releaseDateGTE };
      delete filter.releaseDateGTE;
    } else if (filter.releaseDate) {
      filter.releaseDate = { $eq: filter.releaseDate };
    }

    if (filter.ageRestrictionLTE && filter.ageRestrictionGTE) {
      filter.ageRestriction = { $gte: filter.ageRestrictionGTE, $lte: filter.ageRestrictionLTE };
      delete filter.ageRestrictionGTE;
      delete filter.ageRestrictionLTE;
    } else if (filter.ageRestrictionLTE) {
      filter.ageRestriction = { $lte: filter.ageRestrictionLTE };
      delete filter.ageRestrictionLTE;
    } else if (filter.ageRestrictionGTE) {
      filter.ageRestriction = { $gte: filter.ageRestrictionGTE };
      delete filter.ageRestrictionGTE;
    } else if (filter.ageRestriction) {
      filter.ageRestriction = { $eq: filter.ageRestriction };
    }

    return filter;
  }
}
