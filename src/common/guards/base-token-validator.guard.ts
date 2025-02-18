import { ExecutionContext, Logger } from '@nestjs/common';
import { ForbiddenEndpointException, TokenExpiredException, TokenInvalidException, TokenNotFoundException, TokenUndefinedException } from '../errors';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from '../../core/redis/redis-cache.service';
import { TokenValidatorLogic } from '../logics/token-validator.logic';
import { TOKEN_EXPIRED_ERROR } from '../constants/errors';

export class BaseTokenValidatorGuard {
  protected logger = new Logger(BaseTokenValidatorGuard.name);
  constructor(
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
    protected readonly redisCacheService: RedisCacheService,
  ) {}

  async extractTokenData(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const endpointKey = request.method + '|' + request.route.path;

    const token = TokenValidatorLogic.getTokenFromRequest(request);

    if (!token) {
      throw new TokenNotFoundException();
    }

    const tokenData = await this.jwtService.verifyAsync(token).catch((err) => {
      this.logger.error(err);
      if (err.name === TOKEN_EXPIRED_ERROR) {
        throw new TokenExpiredException();
      } else {
        throw new TokenInvalidException();
      }
    });

    if (!tokenData) {
      throw new TokenUndefinedException();
    }
    const { publicKey } = tokenData;
    const redisData: any = await this.redisCacheService.getHashAll(publicKey);

    if (!redisData) {
      throw new TokenExpiredException();
    }
    const { endpoints } = redisData;
    if (!endpoints) {
      throw new TokenUndefinedException();
    }
    if (!endpoints.includes(endpointKey)) {
      throw new ForbiddenEndpointException();
    }
    return { redisData, publicKey };
  }
}
