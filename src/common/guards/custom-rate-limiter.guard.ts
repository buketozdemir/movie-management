import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata } from '@nestjs/common';
import * as md5 from 'md5';
import { RateLimiterException } from '../errors';
import { ConfigService } from '@nestjs/config';
import { RateLimiterKeyMap, RateLimiterOptions, RateLimits } from '../interfaces/rate-limit';
import { RedisCacheService } from '../../core/redis/redis-cache.service';

@Injectable()
export class CustomRateLimiter implements CanActivate {
  logger: Logger = new Logger(CustomRateLimiter.name);
  prefix = 'RATE_LIMITER';
  limit: number;
  ttl: number;

  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly configService: ConfigService,
  ) {
    this.limit = this.configService.get<number>('RATE_LIMITER.DEFAULT_LIMIT');
    this.ttl = this.configService.get<number>('RATE_LIMITER.DEFAULT_TTL');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { limits, skip = false } = this.getRateLimits(context);
    if (skip) return true;

    const { req } = this.getRequestResponse(context);

    const rateLimits = limits ? limits : this.getDefaultLimits();
    let success = false;
    let remainingTime = 0;
    let attempt = 0;

    const rawKeys = await this.getKeys(req, rateLimits);
    const multi = this.redisCacheService.redis.multi();
    for (const { limit, ttl, keyMap } of rateLimits.sort((a, b) => b.ttl - a.ttl)) {
      success = false;

      const key = this.generateKey(req, limit, ttl, keyMap);
      const rawKey = rawKeys[key];
      attempt = parseInt(rawKey.value, 10);

      if (!rawKey.value) {
        attempt = limit;
        multi.set(key, limit - 1, 'EX', ttl);
        success = true;
      } else {
        remainingTime = rawKey.expire || 0;
        remainingTime = remainingTime < 0 ? 0 : remainingTime;
        if (attempt) {
          if (remainingTime === 0) {
            attempt = limit;
            remainingTime = ttl;
            multi.set(key, limit - 1, 'EX', ttl);
            success = true;
          } else {
            multi.set(key, attempt - 1, 'EX', remainingTime);
            success = true;
          }
        }
      }
      if (!success) break;
    }
    await multi.exec();
    if (!success) {
      throw new RateLimiterException();
    }

    return true;
  }

  private getRateLimits(context: ExecutionContext): RateLimiterOptions {
    return Reflect.getMetadata('rateLimitOptions', context.getHandler()) || [];
  }

  private getRequestResponse(context: ExecutionContext): {
    req: Record<string, any>;
    res: Record<string, any>;
  } {
    const http = context.switchToHttp();
    return { req: http.getRequest(), res: http.getResponse() };
  }

  private async getKeys(req: Record<string, any>, rateLimits: RateLimits[]) {
    const keyObject = {};
    const keyList: string[] = [];
    for (const { limit, ttl, keyMap } of rateLimits.sort((a, b) => b.ttl - a.ttl)) {
      const key = this.generateKey(req, limit, ttl, keyMap);
      keyList.push(key);
    }
    const results = await this.redisCacheService.getStringMultiple(keyList);
    for (let i = 0; i < results.length; i++) {
      keyObject[keyList[i]] = { value: results[i], expire: await this.redisCacheService.getExpire(keyList[i]) };
    }
    return keyObject;
  }

  private generateKey(req: Record<string, any>, limit: number, ttl: number, keymap?: RateLimiterKeyMap): string {
    let key = this.getDefaultKey(req, limit, ttl);
    if (!keymap) return `${this.prefix}_${md5(key)}`;

    const customKeys: string[] = [
      ...this.getCustomKeys(req, 'headers', keymap.headers),
      ...this.getCustomKeys(req, 'body', keymap.body),
      ...this.getCustomKeys(req, 'query', keymap.query),
    ];

    key += customKeys.join('-');
    return `${this.prefix}_${md5(key)}`;
  }

  private getRemoteAddress(req: Record<string, any>): string {
    return (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.info?.remoteAddress || req.ip)?.toString();
  }
  private getDefaultLimits(): RateLimits[] {
    return [{ limit: this.limit, ttl: this.ttl }];
  }

  private getDefaultKey(req: Record<string, any>, limit: number, ttl: number) {
    const ipAddress = this.getRemoteAddress(req);
    const splitUrl = req.url.split('?');
    const deviceId = req.deviceId;
    const method = req.method;
    return deviceId ? `${method}-${splitUrl[0]}-${ipAddress}-${deviceId}-${limit}-${ttl}` : `${method}-${splitUrl[0]}-${ipAddress}-${limit}-${ttl}`;
  }

  private getCustomKeys(req: Record<string, any>, target: string, keys: string[]) {
    if (!keys || !keys.length) return [];

    const results: string[] = [];
    for (const key of keys) {
      const splitKey = key.split('.');
      if (splitKey.length > 1) {
        if (req[target][splitKey[0]] && req[target][splitKey[0]][splitKey[1]]) {
          results.push(req[target][splitKey[0]][splitKey[1]]);
        }
      } else {
        if (req[target][key]) {
          results.push(req[target][key]);
        }
      }
    }
    return results;
  }
}

export const CustomRateLimiterGuard = (options: RateLimiterOptions) => {
  return SetMetadata('rateLimitOptions', options);
};
