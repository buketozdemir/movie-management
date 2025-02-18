import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheBaseService } from './redis-cache-base.service';

@Injectable()
export class RedisCacheService extends RedisCacheBaseService {
  constructor(configService: ConfigService, redisClient: any) {
    super(configService, redisClient);
  }
}
