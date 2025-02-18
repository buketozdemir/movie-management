import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../src/config';
import { Configs } from '../configs';
import { TokenValidatorGuard } from '../../src/common/guards';
import { TokenNotFoundException } from '../../src/common/errors';

describe('TokenValidatorGuard', () => {
  let guard: TokenValidatorGuard;
  const providers: any = [];

  interface MockExecutionContext {
    route?: object;
    method?: string;
    params?: object;
    query?: object;
    body?: object;
    headers?: object;
    isPublic?: boolean;
  }

  const createMockExecutionContext = (payload: MockExecutionContext) => {
    const { route, method, params, headers, query, body, isPublic = false } = payload;
    const handler = () => {};
    Reflect.defineMetadata('isPublic', isPublic, handler);
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          route: route || { path: 'test' },
          method: method || 'POST',
          params: params || {},
          headers: headers || { authorization: 'Bearer ' + Math.random().toString() },
          query: query || {},
          body: body || {},
        }),
      }),
      getHandler: jest.fn().mockImplementation(() => handler),
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

    guard = module.get<TokenValidatorGuard>(TokenValidatorGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw TokenNotFoundException if token is not found', async () => {
    const mockExecutionContext = createMockExecutionContext({ headers: {} });
    await expect(guard.canActivate(mockExecutionContext as unknown as ExecutionContext)).rejects.toThrow(TokenNotFoundException);
  });
});
