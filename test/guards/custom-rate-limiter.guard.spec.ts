import { Test, TestingModule } from '@nestjs/testing';
import { Configs } from '../configs';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../src/config';
import { CustomRateLimiter } from '../../src/common/guards';
import { ExecutionContext } from '@nestjs/common';
import { RateLimiterException } from '../../src/common/errors';
import RATE_LIMITS from '../../src/common/constants/rate-limits';

describe('CustomRateLimiter', () => {
  let guard: CustomRateLimiter;
  const providers: any = [];
  interface RequestParams {
    count?: number;
    headers?: object;
    url?: string;
    method?: string;
    body?: object;
    keyMap?: object;
    ip?: string;
  }

  function createRequests(params: RequestParams) {
    const requests = [];
    for (let i = 0; i < params.count; i++) {
      requests.push({
        headers: params.headers || { 'device-id': '123456' },
        url: params.url || '/test',
        method: params.method || 'GET',
        body: params.body || { gsm: '5555555555', gsmCountryCode: '90' },
        keyMap: params.keyMap || {
          headers: ['device-id'],
          body: ['gsm', 'gsmCountryCode'],
        },
        ip: params.ip || '127.0.0.1',
      });
    }
    return requests;
  }

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

    guard = module.get<CustomRateLimiter>(CustomRateLimiter);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if canActivate is successful', async () => {
    const requests = createRequests({ count: 1, ip: Math.random().toString() });
    const handler = () => {};
    Reflect.defineMetadata('rateLimitOptions', { limits: RATE_LIMITS.TEMP_USER }, handler);
    const context = {
      switchToHttp: () => ({
        getRequest: () => requests.shift(),
        getResponse: () => ({
          header: jest.fn(),
        }),
      }),
      getHandler: jest.fn().mockImplementation(() => handler),
    };

    const result = await guard.canActivate(context as unknown as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should throws RateLimiterException when exceeding the maximum allowed request limit', async () => {
    const requestCount = RATE_LIMITS.TEMP_USER[0].limit + 1;
    const requests = createRequests({ count: requestCount, ip: Math.random().toString() });
    const handler = () => {};
    Reflect.defineMetadata('rateLimitOptions', { limits: RATE_LIMITS.TEMP_USER }, handler);
    const context = {
      switchToHttp: () => ({
        getRequest: () => requests.shift(),
        getResponse: () => ({
          header: jest.fn(),
        }),
      }),
      getHandler: jest.fn().mockImplementation(() => handler),
    };

    for (let i = 0; i < RATE_LIMITS.TEMP_USER[0].limit; i++) {
      await expect(guard.canActivate(context as unknown as ExecutionContext)).resolves.toBe(true);
    }
    await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toThrow(RateLimiterException);
  });
});
