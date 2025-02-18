import { ErrorStandard } from '../interfaces';

const ERROR_MESSAGES = {
  EXTERNAL_SERVICE_CALLER: (serviceName: string, error: string): ErrorStandard => ({
    code: 1000,
    error: `external service caller error: ${serviceName}`,
    message: error,
  }),
  TOKEN_EXPIRED: {
    code: 1000,
    error: 'TOKEN_EXPIRED',
    message: 'Token expired error',
  },
  REFRESH_TOKEN_INVALID_ERROR: {
    code: 1001,
    error: 'REFRESH_TOKEN_INVALID_ERROR',
    message: 'Refresh token invalid error',
  },
  TOKEN_INVALID: {
    code: 1002,
    error: 'TOKEN_INVALID',
    message: 'Token invalid error',
  },
  TOKEN_NOT_FOUND_IN_REDIS: {
    code: 1003,
    error: 'TOKEN_NOT_FOUND',
    message: 'Token not found',
  },
  TOKEN_UNDEFINED_ERROR: {
    code: 1004,
    error: 'TOKEN_UNDEFINED_ERROR',
    message: 'Token undefined error',
  },
  FORBIDDEN_ENDPOINT: {
    code: 1005,
    error: 'FORBIDDEN_ENDPOINT',
    message: 'This endpoint is forbidden',
  },
  ACCESS_TOKEN_NOT_AVAILABLE_ERROR: {
    code: 1006,
    error: 'ACCESS_TOKEN_NOT_AVAILABLE_ERROR',
    message: 'Access token not available error',
  },
  REFRESH_TOKEN_EXPIRED: {
    code: 1007,
    error: 'REFRESH_TOKEN_EXPIRED',
    message: 'Refresh token expired error',
  },
  USER_PERMISSION_DENIED: {
    code: 1008,
    error: 'USER_PERMISSION_DENIED',
    message: 'User permission denied error',
  },
  RATE_LIMITER_EXCEEDED: {
    error: 'RATE_LIMITER_EXCEEDED',
    code: 2000,
    message: `Rate limit exceeded. Please try again later`,
  },
  USER_NOT_FOUND: {
    error: 'USER_NOT_FOUND',
    code: 3000,
    message: `User not found`,
  },
  USER_ROLE_NOT_FOUND: {
    error: 'USER_ROLE_NOT_FOUND',
    code: 3001,
    message: `User role not found`,
  },
  USER_ALREADY_EXISTS: {
    error: 'USER_ALREADY_EXISTS',
    code: 3002,
    message: `User already exists`,
  },
  USER_ROLE_ALREADY_EXISTS: {
    error: 'USER_ROLE_ALREADY_EXISTS',
    code: 3003,
    message: `User role already exists`,
  },
  MOVIE_NOT_FOUND: {
    error: 'MOVIE_NOT_FOUND',
    code: 3004,
    message: `Movie not found`,
  },
  MOVIE_ALREADY_EXISTS: {
    error: 'MOVIE_ALREADY_EXISTS',
    code: 3005,
    message: `Movie already exists`,
  },
  MOVIE_SESSION_ALREADY_EXISTS: {
    error: 'MOVIE_SESSION_ALREADY_EXISTS',
    code: 3006,
    message: `Movie session already exists`,
  },
  MOVIE_SESSION_NOT_FOUND: {
    error: 'MOVIE_SESSION_NOT_FOUND',
    code: 3007,
    message: `Movie session not found`,
  },
  ROOM_NOT_FOUND: {
    error: 'ROOM_NOT_FOUND',
    code: 3008,
    message: `Room not found`,
  },
  ROOM_ALREADY_EXISTS: {
    error: 'ROOM_ALREADY_EXISTS',
    code: 3009,
    message: `Room already exists`,
  },
  TICKET_NOT_FOUND: {
    error: 'TICKET_NOT_FOUND',
    code: 3010,
    message: `Ticket not found`,
  },
  TICKET_ALREADY_EXISTS: {
    error: 'TICKET_ALREADY_EXISTS',
    code: 3011,
    message: `Ticket already exists`,
  },
  MOVIE_NOT_ACTIVE: {
    error: 'MOVIE_NOT_ACTIVE',
    code: 3012,
    message: `Movie is not active`,
  },
  AGE_RESTRICTION: {
    error: 'AGE_RESTRICTION_ERROR',
    code: 3013,
    message: `User does not meet the age restriction for this movie`,
  },
  ROOM_CAPACITY_IS_FULL: {
    error: 'ROOM_CAPACITY_IS_FULL',
    code: 3014,
    message: `Room capacity is full`,
  },
  MOVIE_SESSION_NOT_ACTIVE: {
    error: 'MOVIE_SESSION_NOT_ACTIVE',
    code: 3015,
    message: `Movie session is not active`,
  },
  MOVIE_SESSION_ALREADY_STARTED: {
    error: 'MOVIE_SESSION_ALREADY_STARTED',
    code: 3016,
    message: `Movie session already started`,
  },
  TICKET_CANCELLED: {
    error: 'TICKET_CANCELLED',
    code: 3017,
    message: `Ticket is cancelled`,
  },
  TICKET_ALREADY_USED: {
    error: 'TICKET_ALREADY_USED',
    code: 3018,
    message: `Ticket is already used`,
  },
  TICKET_EXPIRED: {
    error: 'TICKET_EXPIRED',
    code: 3019,
    message: `Ticket is expired`,
  },
  PASSWORD_MISMATCH: {
    error: 'PASSWORD_MISMATCH',
    code: 3020,
    message: `Password mismatch`,
  },
  OLD_PASSWORD_MISMATCH: {
    error: 'OLD_PASSWORD_MISMATCH',
    code: 3021,
    message: `Old password mismatch`,
  },
  INVALID_CREDENTIALS: {
    error: 'INVALID_CREDENTIALS',
    code: 4000,
    message: `Invalid username or password`,
  },
};

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';

export { ERROR_MESSAGES, TOKEN_EXPIRED_ERROR };
