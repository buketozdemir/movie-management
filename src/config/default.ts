export default () => ({
  NAME: 'movie-management',
  VERSION: process.env.VERSION || 'default',
  ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  TIMEOUT: 10000,
  MONGODB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  },
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT || 6379,
    USERNAME: process.env.REDIS_USERNAME,
    PASSWORD: process.env.REDIS_PASSWORD || 'admin',
  },
  JWT_OPTIONS: {
    JWT_SECRET: process.env.JWT_SECRET || 'VqWlksl1k7d!CD1o4EWq09dkasd32sd99',
  },
  SWAGGER_OPTIONS: {
    title: 'Movie Management',
    description: 'Movie Management Service API description',
    version: process.env.VERSION || '0.0.1',
    contact: {
      name: '',
      email: 'api@email.com',
      url: '',
    },
  },
  RATE_LIMITER: {
    DEFAULT_TTL: process.env.RATE_LIMITER_DEFAULT_TTL || 60,
    DEFAULT_LIMIT: process.env.RATE_LIMITER_DEFAULT_LIMIT || 120,
  },
  ADMIN_USER: {
    PASSWORD: process.env.ADMIN_USER_PASSWORD || 'admin',
  },
});
