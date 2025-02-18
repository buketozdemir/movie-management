import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import { RedisCacheBaseService } from './redis-cache-base.service';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService['internalConfig']['REDIS']['HOST'],
          port: configService['internalConfig']['REDIS']['PORT'],
          password: configService['internalConfig']['REDIS']['PASSWORD'],
        });
      },
      inject: [ConfigService],
    },
    RedisCacheService,
    RedisCacheBaseService,
  ],
  exports: [RedisCacheService],
})
export default class RedisCacheModule {}
