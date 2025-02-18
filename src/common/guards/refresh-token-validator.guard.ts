import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BaseTokenValidatorGuard } from './base-token-validator.guard';
import { TokenValidatorLogic } from '../logics/token-validator.logic';
import {
  AccessTokenNotAvailableException,
  RefreshTokenExpiredException,
  RefreshTokenInvalidException,
  TokenNotFoundException,
  TokenUndefinedException,
} from '../errors';
import { RedisCacheService } from '../../core/redis/redis-cache.service';
import { TOKEN_EXPIRED_ERROR } from '../constants/errors';

@Injectable()
export class RefreshTokenValidatorGuard extends BaseTokenValidatorGuard implements CanActivate {
  protected logger = new Logger(RefreshTokenValidatorGuard.name);
  constructor(
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
    protected readonly redisCacheService: RedisCacheService,
  ) {
    super(configService, jwtService, redisCacheService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = TokenValidatorLogic.getTokenFromRequest(request);

    if (!token) {
      throw new TokenNotFoundException();
    }

    const tokenData = await this.jwtService.decode(token);
    if (!tokenData) {
      throw new TokenUndefinedException();
    }
    const { publicKey } = tokenData;

    const { refreshToken } = request.body;

    const refreshTokenData = await this.jwtService.verifyAsync(refreshToken).catch((err) => {
      this.logger.error(err);
      if (err.name === TOKEN_EXPIRED_ERROR) {
        throw new RefreshTokenExpiredException();
      } else {
        throw new RefreshTokenInvalidException();
      }
    });

    const { publicKey: refreshPublicKey } = refreshTokenData;

    const refreshTokenRedisData = await this.redisCacheService.getHashAll(refreshPublicKey);
    const { accessPublicKey } = refreshTokenRedisData;

    if (publicKey !== accessPublicKey) {
      throw new AccessTokenNotAvailableException();
    }

    request.user = refreshTokenRedisData.user;
    request.publicKey = publicKey;
    return true;
  }
}
