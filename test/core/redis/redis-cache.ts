import Redis from 'ioredis-mock';
import { ConfigService } from '@nestjs/config';
import { RedisCacheBaseService } from '../../../src/core/redis/redis-cache-base.service';

export class MockRedisCacheService extends RedisCacheBaseService {
  constructor() {
    super(new ConfigService(), new Redis());
  }
}
