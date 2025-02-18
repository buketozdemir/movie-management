import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import mongoose from 'mongoose';
import { Configs } from '../configs';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../src/config';
import { UserOwnValidatorGuard } from '../../src/common/guards';
import { UserPermissionDeniedException } from '../../src/common/errors';

describe('UserOwnValidatorGuard', () => {
  let guard: UserOwnValidatorGuard;
  let mockExecutionContext: any;
  const providers: any = [];
  const mockUserId = new mongoose.Types.ObjectId().toString();

  interface MockExecutionContext {
    route?: object;
    params?: object;
    query?: object;
    body?: object;
    user?: object;
  }

  const createMockExecutionContext = (payload: MockExecutionContext) => {
    const { route, params, query, body, user } = payload;
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          route: route || { path: '' },
          params: params || { userId: mockUserId },
          query: query || {},
          body: body || {},
          user: user || { id: mockUserId },
        }),
      }),
    };
  };

  beforeEach(async () => {
    if (providers.length === 0) {
      const { providers: _providers } = await Configs.initial();
      providers.push(..._providers);
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      controllers: [],
      providers: [...providers],
    }).compile();

    guard = module.get<UserOwnValidatorGuard>(UserOwnValidatorGuard);

    mockExecutionContext = createMockExecutionContext({});
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if canActivate is successful', async () => {
    const result = await guard.canActivate(mockExecutionContext as unknown as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw UserPermissionDeniedException if userId is not the same as request.params.userId', async () => {
    const context = createMockExecutionContext({
      route: { path: '/:userId' },
      params: { userId: new mongoose.Types.ObjectId().toString() },
    });
    await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toThrow(UserPermissionDeniedException);
  });

  it('should return true if userId is same as request.params.userId', async () => {
    const context = createMockExecutionContext({
      route: { path: '/:userId' },
    });
    await expect(guard.canActivate(context as unknown as ExecutionContext)).resolves.toBe(true);
  });
});
