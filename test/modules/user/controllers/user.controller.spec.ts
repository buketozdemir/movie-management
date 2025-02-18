import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import configuration from '../../../../src/config';
import { MongoConnection } from '../../../core/mongo';
import { Configs } from '../../../configs';
import { RequestWithHeader } from '../../../../src/common/interfaces/header';
import { UserController } from '../../../../src/modules/user/controllers/user.controller';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';
import mongoose from 'mongoose';
import { OldPasswordMismatchException, PasswordMismatchException, UserNotFoundException } from '../../../../src/common/errors';
import { userBirthDate, userFirstName, userLastName, userPassword, userUserName } from '../mocks';

describe('UserController', () => {
  let shouldRunAfterEach = true;
  const req: RequestWithHeader = {} as RequestWithHeader;
  let userController: UserController;
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
      controllers: [AuthController, UserController],
      providers: [...providers],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    userController = app.get<UserController>(UserController);
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

  describe('UserController', () => {
    it('should successfully create a user', async () => {
      shouldRunAfterEach = false;

      const { data: user } = await userController.createUserController(
        {
          firstName: userFirstName,
          lastName: userLastName,
          password: userPassword,
          userName: userUserName,
          birthDate: userBirthDate,
        },
        req,
      );
      expect(user).toBeDefined();
      expect(user.id.toString()).toBeDefined();
      expect(user.firstName).toBe(userFirstName);
      expect(user.lastName).toBe(userLastName);
      expect(user.userName).toBe(userUserName);
    });

    it('should successfully get users', async () => {
      const { data } = await userController.getUsersController({ limit: 20, page: 1 }, req);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should empty array when getting users with invalid params', async () => {
      const { data } = await userController.getUsersController({ limit: 20, page: 1, userName: 'invalid' }, req);
      expect(data).toBeDefined();
      expect(data.length).toBe(0);
    });

    it('should successfully get a user', async () => {
      const { data: users } = await userController.getUsersController({ limit: 20, page: 1 }, req);
      const userId = users[0].id.toString();
      const { data: user } = await userController.getUserController(userId, {}, req);
      expect(user).toBeDefined();
    });

    it('should empty object when getting a user with invalid userId', async () => {
      const { data } = await userController.getUserController(new mongoose.Types.ObjectId().toString(), {}, req);
      expect(data).toBeDefined();
      expect(data).toBe(null);
    });

    it('should successfully update a user', async () => {
      const { data: users } = await userController.getUsersController({ limit: 20, page: 1, userName: userUserName }, req);
      const userId = users[0].id.toString();
      const { data: user } = await userController.updateUserController(userId, { lastName: 'newLastName', updatedBy: req.user.id }, req);
      expect(user).toBeDefined();
      expect(user).toBe(true);
      const { data: updatedUser } = await userController.getUserController(userId, { projection: 'lastName' }, req);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.lastName).toBe('newLastName');
    });

    it('should successfully change password', async () => {
      const { data: users } = await userController.getUsersController({ limit: 20, page: 1, userName: userUserName }, req);
      const userId = users[0].id.toString();
      const { data: user } = await userController.changePasswordController(
        userId,
        { password: 'newPassword', oldPassword: userPassword, confirmPassword: 'newPassword' },
        req,
      );
      expect(user).toBeDefined();
      expect(user).toBe(true);
    });

    it('should throw PasswordMismatchException when password and confirmPassword do not match', async () => {
      const { data: users } = await userController.getUsersController({ limit: 20, page: 1, userName: userUserName }, req);
      const userId = users[0].id.toString();
      await expect(
        userController.changePasswordController(userId, { password: 'newPassword', oldPassword: userPassword, confirmPassword: 'invalid' }, req),
      ).rejects.toThrow(new PasswordMismatchException());
    });

    it('should throw OldPasswordMismatchException when old password is invalid', async () => {
      const { data: users } = await userController.getUsersController({ limit: 20, page: 1, userName: userUserName }, req);
      const userId = users[0].id.toString();
      await expect(
        userController.changePasswordController(userId, { password: 'newPassword', oldPassword: 'invalid', confirmPassword: 'newPassword' }, req),
      ).rejects.toThrow(new OldPasswordMismatchException());
    });

    it('should successfully delete a user', async () => {
      const { data: users } = await userController.getUsersController({ limit: 20, page: 1 }, req);
      const userId = users[0].id.toString();
      const { data: user } = await userController.deleteUserController(userId, { deletedBy: req.user.id }, req);
      expect(user).toBeDefined();
      expect(user).toBe(true);
    });

    it('should validation error when deleting a user with invalid userId', async () => {
      await expect(userController.deleteUserController(new mongoose.Types.ObjectId().toString(), { deletedBy: req.user.id }, req)).rejects.toThrow(
        new UserNotFoundException(),
      );
    });
  });
});
