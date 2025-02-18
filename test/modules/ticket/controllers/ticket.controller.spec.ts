import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import configuration from '../../../../src/config';
import { MongoConnection } from '../../../core/mongo';
import { Configs } from '../../../configs';
import { RequestWithHeader } from '../../../../src/common/interfaces/header';
import { TicketController } from '../../../../src/modules/ticket/controllers/ticket.controller';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';
import { MovieService } from '../../../../src/modules/movie/services/movie.service';
import mongoose from 'mongoose';
import { TicketNotFoundException } from '../../../../src/common/errors';

describe('TicketController', () => {
  let shouldRunAfterEach = true;
  const req: RequestWithHeader = {} as RequestWithHeader;
  let ticketController: TicketController;
  let movieService: MovieService;
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
      controllers: [AuthController, TicketController],
      providers: [...providers],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    ticketController = app.get<TicketController>(TicketController);
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

  describe('TicketController', () => {
    it('should successfully create a ticket', async () => {
      shouldRunAfterEach = false;

      const { data: movies } = await movieService.getMovies({ limit: 20, page: 1, filter: {}, projection: 'id sessions' });
      const { data: ticket } = await ticketController.createTicketController(
        {
          movie: movies[0].id.toString(),
          session: movies[0].sessions[0]._id.toString(),
          user: req.user.id,
          createdBy: req.user.id,
        },
        req,
      );
      expect(ticket).toBeDefined();
      expect(ticket.id.toString()).toBeDefined();
      expect(ticket.ticketNumber).toBeDefined();
      expect(ticket.status).toBeDefined();
    });

    it('should successfully get tickets', async () => {
      const { data } = await ticketController.getTicketsController({ limit: 20, page: 1 }, req);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should empty array when getting tickets with invalid params', async () => {
      const { data } = await ticketController.getTicketsController({ limit: 20, page: 1, movie: new mongoose.Types.ObjectId().toString() }, req);
      expect(data).toBeDefined();
      expect(data.length).toBe(0);
    });

    it('should successfully get a ticket', async () => {
      const { data: tickets } = await ticketController.getTicketsController({ limit: 20, page: 1 }, req);
      const ticketId = tickets[0].id.toString();
      const { data: ticket } = await ticketController.getTicketController(ticketId, {}, req);
      expect(ticket).toBeDefined();
    });

    it('should empty object when getting a ticket with invalid ticketId', async () => {
      const { data } = await ticketController.getTicketController(new mongoose.Types.ObjectId().toString(), {}, req);
      expect(data).toBeDefined();
      expect(data).toBe(null);
    });

    it('should successfully delete a ticket', async () => {
      const { data: tickets } = await ticketController.getTicketsController({ limit: 20, page: 1 }, req);
      const ticketId = tickets[0].id.toString();
      const { data: ticket } = await ticketController.deleteTicketController(ticketId, req);
      expect(ticket).toBeDefined();
      expect(ticket).toBe(true);
    });

    it('should validation error when deleting a ticket with invalid ticketId', async () => {
      await expect(ticketController.deleteTicketController(new mongoose.Types.ObjectId().toString(), req)).rejects.toThrow(new TicketNotFoundException());
    });
  });
});
