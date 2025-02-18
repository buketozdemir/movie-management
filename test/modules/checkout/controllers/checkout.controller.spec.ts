import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import configuration from '../../../../src/config';
import { MongoConnection } from '../../../core/mongo';
import { Configs } from '../../../configs';
import { RequestWithHeader } from '../../../../src/common/interfaces/header';
import { CheckoutController } from '../../../../src/modules/checkout/controllers/checkout.controller';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';
import { MovieService } from '../../../../src/modules/movie/services/movie.service';
import { MovieStatus } from '../../../../src/modules/movie/movie.enum';
import { userPassword } from '../../user/mocks';
import {
  AgeRestrictionException,
  MovieNotActiveException,
  MovieSessionAlreadyStartedException,
  MovieSessionNotActiveException,
  PasswordMismatchException, RoomCapacityIsFullException,
} from '../../../../src/common/errors';
import { movieId1, movieId2, movieId3, movieId4 } from '../../../core/mongo/mock';

describe('CheckoutController', () => {
  let shouldRunAfterEach = true;
  const req: RequestWithHeader = {} as RequestWithHeader;
  let checkoutController: CheckoutController;
  let authController: AuthController;
  let configService: ConfigService;
  let movieService: MovieService;
  let mongoConnection: MongoConnection;
  let app: INestApplication;
  let accessToken = '';

  beforeAll(async () => {
    const { providers, mongoConnection: _mongoConnection } = await Configs.initial();
    mongoConnection = _mongoConnection;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      controllers: [AuthController, CheckoutController],
      providers: [...providers],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    checkoutController = app.get<CheckoutController>(CheckoutController);
    authController = app.get<AuthController>(AuthController);
    configService = app.get<ConfigService>(ConfigService);
    movieService = app.get<MovieService>(MovieService);

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

  describe('CheckoutController', () => {
    it('should successfully create a checkout', async () => {
      shouldRunAfterEach = false;

      const { data: movies } = await movieService.getMovies({ page: 1, limit: 1, filter: { status: MovieStatus.Active }, projection: 'id sessions' });
      const movieId = movies[0].id;
      const sessionId = movies[0].sessions[0]._id;

      const { data: checkout } = await checkoutController.createCheckoutController(
        {
          movieId,
          sessionId,
        },
        req,
      );
      expect(checkout).toBeDefined();
      expect(checkout).toBe(true);
    });

    it('should throw MovieNotActiveException when creating a checkout with inactive movie', async () => {
      await expect(
        checkoutController.createCheckoutController(
          {
            movieId: movieId3.toString(),
            sessionId: '67b337290c1ee23d9f593263',
          },
          req,
        ),
      ).rejects.toThrow(new MovieNotActiveException());
    });

    it('should throw MovieSessionNotActiveException when creating a checkout with inactive movie session', async () => {
      await expect(
        checkoutController.createCheckoutController(
          {
            movieId: movieId2.toString(),
            sessionId: '67b33732b055def04e19217c',
          },
          req,
        ),
      ).rejects.toThrow(new MovieSessionNotActiveException());
    });

    it('should throw MovieSessionAlreadyStartedException when creating a checkout with started movie session', async () => {
      await expect(
        checkoutController.createCheckoutController(
          {
            movieId: movieId2.toString(),
            sessionId: '67b3372ef8d8507e7ad14d29',
          },
          req,
        ),
      ).rejects.toThrow(new MovieSessionAlreadyStartedException());
    });

    it('should throw AgeRestrictionException when creating a checkout with user under age restriction', async () => {
      await expect(
        checkoutController.createCheckoutController(
          {
            movieId: movieId4.toString(),
            sessionId: '67b34697fa04262e78446574',
          },
          req,
        ),
      ).rejects.toThrow(new AgeRestrictionException());
    });

    it('should throw RoomCapacityIsFullException when creating a checkout with full room capacity', async () => {
      await expect(
        checkoutController.createCheckoutController(
          {
            movieId: movieId1.toString(),
            sessionId: '67b3371dde73dec699aabe3c',
          },
          req,
        ),
      ).rejects.toThrow(new RoomCapacityIsFullException());
    });
  });
});
