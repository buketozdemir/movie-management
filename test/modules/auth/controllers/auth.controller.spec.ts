import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import configuration from '../../../../src/config';
import { MongoConnection } from '../../../core/mongo';
import { Configs } from '../../../configs';
import { RequestWithHeader } from '../../../../src/common/interfaces/header';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';
import { MOCK_USER } from '../mocks';
import { InvalidCredentialsException, RefreshTokenInvalidException, TokenInvalidException, UserAlreadyExistsException } from '../../../../src/common/errors';

describe('AuthController', () => {
  let shouldRunAfterEach = true;
  const req: RequestWithHeader = {} as RequestWithHeader;
  let authController: AuthController;
  let mongoConnection: MongoConnection;
  let app: INestApplication;
  let userId = '';
  let accessToken = '';
  let refreshToken = '';

  beforeAll(async () => {
    const { providers, mongoConnection: _mongoConnection } = await Configs.initial();
    mongoConnection = _mongoConnection;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      controllers: [AuthController],
      providers: [...providers],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    authController = app.get<AuthController>(AuthController);
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

  describe('AuthController', () => {
    it('should successfully signup', async () => {
      const { data } = await authController.signUpController(MOCK_USER, req);
      expect(data).toBeDefined();
      expect(data.id.toString()).toBeDefined();
      expect(data.firstName.toString()).toBe(MOCK_USER.firstName.toString());
      expect(data.lastName.toString()).toBe(MOCK_USER.lastName.toString());
      userId = data.id.toString();
      shouldRunAfterEach = false;
    });

    it('should throw UserAlreadyExistsException when user already exists', async () => {
      await expect(authController.signUpController(MOCK_USER, req)).rejects.toThrow(new UserAlreadyExistsException());
      shouldRunAfterEach = false;
    });

    it('should successfully login', async () => {
      const { data } = await authController.loginController({ userName: MOCK_USER.userName, password: MOCK_USER.password });
      expect(data).toBeDefined();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(userId);
      expect(data.user.firstName).toBe(MOCK_USER.firstName);
      expect(data.user.lastName).toBe(MOCK_USER.lastName);
      expect(data.user.userName).toBe(MOCK_USER.userName);
      expect(data.refreshTokenExpires).toBeDefined();
      expect(data.accessTokenExpires).toBeDefined();
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
    });

    it('should throw InvalidCredentialsException when user does not exist', async () => {
      await expect(authController.loginController({ userName: 'invalid', password: 'invalid' })).rejects.toThrow(new InvalidCredentialsException());
    });

    it('should throw InvalidCredentialsException when password is incorrect', async () => {
      await expect(authController.loginController({ userName: MOCK_USER.userName, password: 'invalid' })).rejects.toThrow(new InvalidCredentialsException());
    });

    it('should successfully refresh token', async () => {
      req.user = { userName: MOCK_USER.userName, lastName: MOCK_USER.lastName, firstName: MOCK_USER.firstName, id: userId };
      const { data } = await authController.accessTokenViaRefreshTokenController({ user: userId, refreshToken }, req);
      expect(data).toBeDefined();
      expect(data.accessToken).toBeDefined();
      expect(data.accessTokenExpires).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(userId);
      expect(data.user.firstName).toBe(MOCK_USER.firstName);
      expect(data.user.lastName).toBe(MOCK_USER.lastName);
      expect(data.roles).toBeDefined();
    });

    it('should throw RefreshTokenInvalidException when req user is mismatched', async () => {
      req.user = { userName: MOCK_USER.userName, lastName: MOCK_USER.lastName, firstName: MOCK_USER.firstName, id: 'invalid' };
      await expect(authController.accessTokenViaRefreshTokenController({ user: userId, refreshToken }, req)).rejects.toThrow(
        new RefreshTokenInvalidException(),
      );
    });

    it('should throw TokenInvalidException when refresh token is invalid', async () => {
      req.user = { userName: MOCK_USER.userName, lastName: MOCK_USER.lastName, firstName: MOCK_USER.firstName, id: userId };
      await expect(authController.accessTokenViaRefreshTokenController({ user: userId, refreshToken: 'invalid' }, req)).rejects.toThrow(
        new TokenInvalidException(),
      );
    });
  });
});
