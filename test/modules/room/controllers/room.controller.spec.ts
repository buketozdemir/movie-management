import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import configuration from '../../../../src/config';
import { MongoConnection } from '../../../core/mongo';
import { Configs } from '../../../configs';
import { RequestWithHeader } from '../../../../src/common/interfaces/header';
import mongoose from 'mongoose';
import { RoomNotFoundException } from '../../../../src/common/errors';
import { RoomController } from '../../../../src/modules/room/controllers/room.controller';
import { roomCapacity, roomCreatedBy, roomName, roomStatus } from '../mocks';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';

describe('RoomController', () => {
  let shouldRunAfterEach = true;
  const req: RequestWithHeader = {} as RequestWithHeader;
  let roomController: RoomController;
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
      controllers: [AuthController, RoomController],
      providers: [...providers],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    roomController = app.get<RoomController>(RoomController);
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

  describe('RoomController', () => {
    it('should successfully create a room', async () => {
      shouldRunAfterEach = false;
      const { data: room } = await roomController.createRoomController(
        {
          name: roomName,
          capacity: roomCapacity,
          status: roomStatus,
          createdBy: roomCreatedBy,
        },
        req,
      );
      expect(room).toBeDefined();
      expect(room.id.toString()).toBeDefined();
      expect(room.name).toBe(roomName);
      expect(room.status).toBe(roomStatus);
    });

    it('should successfully get rooms', async () => {
      const { data } = await roomController.getRoomsController({ limit: 20, page: 1 }, req);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should empty array when getting rooms with invalid params', async () => {
      const { data } = await roomController.getRoomsController({ limit: 20, page: 1, name: 'xxx' }, req);
      expect(data).toBeDefined();
      expect(data.length).toBe(0);
    });

    it('should successfully get a room', async () => {
      const { data: rooms } = await roomController.getRoomsController({ limit: 20, page: 1 }, req);
      const roomId = rooms[1].id.toString();
      const { data: room } = await roomController.getRoomController(roomId, {}, req);
      expect(room).toBeDefined();
    });

    it('should empty object when getting a room with invalid roomId', async () => {
      const { data } = await roomController.getRoomController(new mongoose.Types.ObjectId().toString(), {}, req);
      expect(data).toBeDefined();
      expect(data).toBe(null);
    });

    it('should successfully delete a room', async () => {
      const { data: rooms } = await roomController.getRoomsController({ limit: 20, page: 1 }, req);
      const roomId = rooms[0].id.toString();
      const { data: room } = await roomController.deleteRoomController(roomId, req);
      expect(room).toBeDefined();
      expect(room).toBe(true);
    });

    it('should validation error when deleting a room with invalid roomId', async () => {
      await expect(roomController.deleteRoomController(new mongoose.Types.ObjectId().toString(), req)).rejects.toThrow(new RoomNotFoundException());
    });
  });
});
