import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import configuration from '../../../../src/config';
import { MongoConnection } from '../../../core/mongo';
import { Configs } from '../../../configs';
import { RequestWithHeader } from '../../../../src/common/interfaces/header';
import mongoose from 'mongoose';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';
import { UserMovieController } from '../../../../src/modules/user-movie/controllers/user-movie.controller';
import { movieId1, userId1, userName1, userPassword1 } from '../../../core/mongo/mock';
import { CheckoutService } from '../../../../src/modules/checkout/services/checkout.service';

describe('UserMovieController', () => {
  const shouldRunAfterEach = false;
  const req: RequestWithHeader = {} as RequestWithHeader;
  let userMovieController: UserMovieController;
  let authController: AuthController;
  let checkoutService: CheckoutService;
  let mongoConnection: MongoConnection;
  let app: INestApplication;
  let accessToken = '';
  let movieId = '';
  let ticketId = '';

  beforeAll(async () => {
    const { providers, mongoConnection: _mongoConnection } = await Configs.initial();
    mongoConnection = _mongoConnection;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      controllers: [AuthController, UserMovieController],
      providers: [...providers],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    userMovieController = app.get<UserMovieController>(UserMovieController);
    authController = app.get<AuthController>(AuthController);
    checkoutService = app.get<CheckoutService>(CheckoutService);

    const { data } = await authController.loginController({ userName: userName1, password: userPassword1 });
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

  describe('UserMovieController', () => {
    it('should successfully get user movies', async () => {
      const { data } = await userMovieController.getMoviesController(userName1, { limit: 20, page: 1 }, req);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      movieId = data[0].id;
    });

    it('should successfully get a user movie', async () => {
      const { data: movie } = await userMovieController.getMovieController(userName1, movieId, req);
      expect(movie).toBeDefined();
    });

    it('should empty object when getting a room with invalid movieId', async () => {
      const { data } = await userMovieController.getMovieController(userName1, new mongoose.Types.ObjectId().toString(), req);
      expect(data).toBeDefined();
      expect(data).toBe(null);
    });

    it('should successfully watch a movie', async () => {
      await checkoutService.checkout({ movieId: movieId1, sessionId: '67b3371dde73dec699aabe3c', userId: userId1 });
      const { data: tickets } = await userMovieController.getTicketsController(userId1, { limit: 20, page: 1 }, req);
      expect(tickets).toBeDefined();
      expect(tickets.length).toBeGreaterThan(0);
      const ticketId = tickets[0].id;
      const { data } = await userMovieController.watchMovieController(userId1, movieId1, { ticketId }, req);
      expect(data).toBeDefined();
      expect(data).toBe(true);
    });

    it('should successfully get user tickets', async () => {
      const { data } = await userMovieController.getTicketsController(userId1, { limit: 20, page: 1 }, req);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      ticketId = data[0].id;
    });

    it('should successfully get a user ticket', async () => {
      const { data: ticket } = await userMovieController.getTicketController(userId1, ticketId, req);
      expect(ticket).toBeDefined();
    });

    it('should empty object when getting a ticket with invalid ticketId', async () => {
      const { data } = await userMovieController.getTicketController(userId1, new mongoose.Types.ObjectId().toString(), req);
      expect(data).toBeDefined();
      expect(data).toBe(null);
    });

    it('should successfully get user watch history', async () => {
      const { data } = await userMovieController.getWatchHistoryController(userId1, { limit: 20, page: 1 }, req);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      for (const item of data) {
        expect(item.movieName).toBeDefined();
        expect(item.status).toBeDefined();
        expect(item.movie).toBeDefined();
        expect(item.watchedAt).toBeDefined();
        expect(item.ticketNumber).toBeDefined();
        expect(item.ticket).toBeDefined();
        expect(item.movieReleaseDate).toBeDefined();
      }
    });
  });
});
