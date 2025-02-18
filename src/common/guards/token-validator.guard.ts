import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BaseTokenValidatorGuard } from './base-token-validator.guard';
import { RedisCacheService } from '../../core/redis/redis-cache.service';

@Injectable()
export class TokenValidatorGuard extends BaseTokenValidatorGuard implements CanActivate {
  defaultLanguage: string;
  protected logger = new Logger(TokenValidatorGuard.name);
  constructor(
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
    protected readonly redisCacheService: RedisCacheService,
  ) {
    super(configService, jwtService, redisCacheService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { redisData, publicKey } = await this.extractTokenData(context);
    const { user, roles } = redisData;
    request.user = { roles, ...user };
    request.publicKey = publicKey;
    return true;
  }
}
