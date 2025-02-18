import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorParams } from '../interfaces';
import { ERROR_MESSAGES } from '../constants/errors';

export class HttpCustomException extends HttpException {
  constructor(error: ErrorParams, httpStatus: number) {
    super(error, httpStatus);
  }
}

export class RateLimiterException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.RATE_LIMITER_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class UserNotFoundException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class UserRoleNotFoundException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.USER_ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class UserRoleAlreadyExistsException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.USER_ROLE_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
  }
}

export class RefreshTokenInvalidException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.REFRESH_TOKEN_INVALID_ERROR, HttpStatus.UNAUTHORIZED);
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
  }
}

export class TokenInvalidException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.TOKEN_INVALID, HttpStatus.FORBIDDEN);
  }
}

export class TokenNotFoundException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.TOKEN_NOT_FOUND_IN_REDIS, HttpStatus.UNAUTHORIZED);
  }
}

export class TokenUndefinedException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.TOKEN_UNDEFINED_ERROR, HttpStatus.FORBIDDEN);
  }
}

export class ForbiddenEndpointException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.FORBIDDEN_ENDPOINT, HttpStatus.FORBIDDEN);
  }
}

export class AccessTokenNotAvailableException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.ACCESS_TOKEN_NOT_AVAILABLE_ERROR, HttpStatus.BAD_REQUEST);
  }
}

export class RefreshTokenExpiredException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
  }
}

export class UserPermissionDeniedException extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.USER_PERMISSION_DENIED, HttpStatus.FORBIDDEN);
  }
}

export class MovieNotFoundException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.MOVIE_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class MovieAlreadyExistsException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.MOVIE_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class MovieSessionNotFoundException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.MOVIE_SESSION_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class MovieSessionAlreadyExistsException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.MOVIE_SESSION_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class RoomNotFoundException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class RoomAlreadyExistsException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.ROOM_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class TicketNotFoundException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.TICKET_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class TicketAlreadyExistsException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.TICKET_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class MovieNotActiveException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.MOVIE_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
  }
}

export class AgeRestrictionException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.AGE_RESTRICTION, HttpStatus.FORBIDDEN);
  }
}

export class RoomCapacityIsFullException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.ROOM_CAPACITY_IS_FULL, HttpStatus.BAD_REQUEST);
  }
}

export class MovieSessionNotActiveException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.MOVIE_SESSION_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
  }
}

export class MovieSessionAlreadyStartedException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.MOVIE_SESSION_ALREADY_STARTED, HttpStatus.BAD_REQUEST);
  }
}

export class TicketCancelledException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.TICKET_CANCELLED, HttpStatus.BAD_REQUEST);
  }
}

export class TicketAlreadyUsedException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.TICKET_ALREADY_USED, HttpStatus.BAD_REQUEST);
  }
}

export class TicketExpiredException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.TICKET_EXPIRED, HttpStatus.BAD_REQUEST);
  }
}

export class PasswordMismatchException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.PASSWORD_MISMATCH, HttpStatus.BAD_REQUEST);
  }
}

export class OldPasswordMismatchException extends HttpCustomException {
  constructor() {
    super(ERROR_MESSAGES.OLD_PASSWORD_MISMATCH, HttpStatus.BAD_REQUEST);
  }
}
