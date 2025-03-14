const PERMISSIONS = {
  REFRESH_TOKEN_ENDPOINTS: ['POST|/auth/access-token'],
  CUSTOMER_ENDPOINTS: [
    'POST|/auth/access-token',
    'POST|/auth/logout',
    'GET|/users/:userId',
    'PATCH|/users/:userId',
    'GET|/movies',
    'GET|/movies/:movieId',
    'GET|/movies/:movieId/sessions',
    'GET|/users/:userId/movies',
    'GET|/users/:userId/movies/:movieId',
    'POST|/checkout',
    'POST|/users/:userId/movies/:movieId/watch',
    'GET|/users/:userId/watch-history',
    'POST|/users/:userId/change-password',
    'GET|/users/:userId/tickets',
    'GET|/users/:userId/tickets/:ticketId',
  ],
  MANAGER_ENDPOINTS: [
    'POST|/auth/access-token',
    'POST|/auth/logout',
    'GET|/users',
    'GET|/users/:userId',
    'POST|/users',
    'PATCH|/users/:userId',
    'DELETE|/users/:userId',
    'POST|/users/:userId/change-password',
    'GET|/users/:userId/roles',
    'PUT|/users/:userId/roles',
    'DELETE|/users/:userId/roles/:roleId',
    'GET|/movies',
    'GET|/movies/:movieId',
    'POST|/movies',
    'POST|/movies/bulk',
    'PATCH|/movies/:movieId',
    'DELETE|/movies/:movieId',
    'DELETE|/movies/bulk',
    'GET|/movies/:movieId/sessions',
    'GET|/movies/:movieId/sessions/:sessionId',
    'PUT|/movies/:movieId/sessions',
    'PATCH|/movies/:movieId/sessions/:sessionId',
    'DELETE|/movies/:movieId/sessions/:sessionId',
    'GET|/rooms',
    'GET|/rooms/:roomId',
    'POST|/rooms',
    'PATCH|/rooms/:roomId',
    'DELETE|/rooms/:roomId',
    'GET|/tickets',
    'GET|/tickets/:ticketId',
    'POST|/tickets',
    'PATCH|/tickets/:ticketId',
    'DELETE|/tickets/:ticketId',
    'GET|/users/:userId/movies',
    'GET|/users/:userId/movies/:movieId',
    'POST|/checkout',
    'POST|/users/:userId/movies/:movieId/watch',
    'GET|/users/:userId/watch-history',
    'GET|/users/:userId/tickets',
    'GET|/users/:userId/tickets/:ticketId',
  ],
};

export { PERMISSIONS };
