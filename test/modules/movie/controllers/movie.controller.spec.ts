import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import configuration from '../../../../src/config';
import { MongoConnection } from '../../../core/mongo';
import { Configs } from '../../../configs';
import { RequestWithHeader } from '../../../../src/common/interfaces/header';
import mongoose from 'mongoose';
import { MovieNotFoundException } from '../../../../src/common/errors';
import { MovieController } from '../../../../src/modules/movie/controllers/movie.controller';
import { movieAgeRestriction, movieCreatedBy, movieName, movieReleaseDate, movieStatus } from '../mocks';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';

describe('MovieController', () => {
  let shouldRunAfterEach = true;
  const req: RequestWithHeader = {} as RequestWithHeader;
  let movieController: MovieController;
  let authController: AuthController;
  let configService: ConfigService;
  let mongoConnection: MongoConnection;
  let app: INestApplication;
  let accessToken = '';

  beforeAll(async () => {
    const { providers, mongoConnection: _mongoConnection } = await Configs.initial();
    mongoConnection = _mongoConnection;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      controllers: [AuthController, MovieController],
      providers: [...providers],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    movieController = app.get<MovieController>(MovieController);
    authController = app.get<AuthController>(AuthController);
    configService = app.get<ConfigService>(ConfigService);

    const { data } = await authController.loginController({ userName: 'admin', password: configService.get<string>('ADMIN_USER.PASSWORD') });
    accessToken = data.accessToken;
    req.token = accessToken;
    req.user = data.user;
  });

  afterAll(async () => {
    try {
      await mongoConnection.close();
      await app.close();
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  });

  afterEach(async () => {
    if (shouldRunAfterEach) {
      try {
        await mongoConnection.clearDatabase();
      } catch (error) {
        console.error('Error clearing MongoDB database:', error);
      }
    }
  });

  describe('MovieController', () => {
    it('should successfully create a movie', async () => {
      shouldRunAfterEach = false;
      const { data: movie } = await movieController.createMovieController(
        {
          name: movieName,
          ageRestriction: movieAgeRestriction,
          releaseDate: movieReleaseDate,
          status: movieStatus,
          createdBy: movieCreatedBy,
        },
        req,
      );
      expect(movie).toBeDefined();
      expect(movie.id.toString()).toBeDefined();
      expect(movie.name).toBe(movieName);
      expect(movie.status).toBe(movieStatus);
      expect(movie.ageRestriction).toBe(movieAgeRestriction);
      expect(movie.releaseDate).toBe(movieReleaseDate);
    });

    it('should successfully create bulk movies', async () => {
      shouldRunAfterEach = false;
      const { data: movies } = await movieController.createBulkMovieController(
        {
          movies: [
            {
              name: movieName + '1',
              ageRestriction: movieAgeRestriction,
              releaseDate: movieReleaseDate,
              status: movieStatus,
              createdBy: movieCreatedBy,
            },
            {
              name: movieName + '2',
              ageRestriction: movieAgeRestriction,
              releaseDate: movieReleaseDate,
              status: movieStatus,
              createdBy: movieCreatedBy,
            },
          ],
        },
        req,
      );
      expect(movies).toBeDefined();
      expect(movies).toBe(true);
    });

    it('should successfully get movies', async () => {
      const { data } = await movieController.getMoviesController({ limit: 20, page: 1 }, req);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should empty array when getting movies with invalid params', async () => {
      const { data } = await movieController.getMoviesController({ limit: 20, page: 1, name: 'xxx' }, req);
      expect(data).toBeDefined();
      expect(data.length).toBe(0);
    });

    it('should successfully get a movie', async () => {
      const { data: movies } = await movieController.getMoviesController({ limit: 20, page: 1 }, req);
      const movieId = movies[1].id.toString();
      const { data: movie } = await movieController.getMovieController(movieId, {}, req);
      expect(movie).toBeDefined();
    });

    it('should empty object when getting a movie with invalid movieId', async () => {
      const { data } = await movieController.getMovieController(new mongoose.Types.ObjectId().toString(), {}, req);
      expect(data).toBeDefined();
      expect(data).toBe(null);
    });

    it('should successfully delete a movie', async () => {
      const { data: movies } = await movieController.getMoviesController({ limit: 20, page: 1 }, req);
      const movieId = movies[0].id.toString();
      const { data: movie } = await movieController.deleteMovieController(movieId, { deletedBy: req.user.id }, req);
      expect(movie).toBeDefined();
      expect(movie).toBe(true);
    });

    it('should successfully delete bulk movies', async () => {
      const { data: movies } = await movieController.getMoviesController({ limit: 20, page: 1 }, req);
      const movieId1 = movies[0].id.toString();
      const movieId2 = movies[1].id.toString();
      const { data: movie } = await movieController.deleteBulkMovieController({ movieIds: [movieId1, movieId2], deletedBy: req.user.id }, req);
      expect(movie).toBeDefined();
      expect(movie).toBe(true);
    });

    it('should validation error when deleting a movie with invalid movieId', async () => {
      await expect(movieController.deleteMovieController(new mongoose.Types.ObjectId().toString(), { deletedBy: req.user.id }, req)).rejects.toThrow(
        new MovieNotFoundException(),
      );
    });
  });
});
