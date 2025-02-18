import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { AccessTokenPayload, LoginPayload, SignUpPayload } from '../auth.interface';
import { UserService } from '../../user/services/user.service';
import {
  InvalidCredentialsException,
  RefreshTokenInvalidException,
  TokenExpiredException,
  TokenInvalidException,
  UserAlreadyExistsException,
} from '../../../common/errors';
import { UserRole } from '../../../common/enums';
import { PERMISSIONS } from '../../../common/constants/permissions';
import AuthLogic from '../auth.logic';
import { RedisCacheService } from '../../../core/redis/redis-cache.service';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../../../common/constants/auth';
import { TOKEN_EXPIRED_ERROR } from '../../../common/constants/errors';
import { Crypt } from '../../../common/utils/crypt';

@Injectable()
export class AuthService {
  protected logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
    private readonly userService: UserService,
  ) {}

  async login(payload: LoginPayload) {
    const { userName, password } = payload;

    const user = await this.userService.getUser({ filter: { userName }, projection: 'id password firstName lastName userName roles' });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await Crypt.comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    const accessPublicKey = uuidv4();
    const accessTokenData: any = { userName };
    const result: any = {};
    const refreshPublicKey = uuidv4();
    const refreshTokenData: any = { endpoints: PERMISSIONS.REFRESH_TOKEN_ENDPOINTS, accessPublicKey };

    accessTokenData.roles = user.roles;
    accessTokenData.endpoints = AuthLogic.getUserEndpointPermissionsFromRoles(user.roles);

    accessTokenData.user = { id: user.id, userName: user.userName, firstName: user.firstName, lastName: user.lastName };
    result.user = accessTokenData.user;

    result.refreshToken = this.generateRefreshToken({ publicKey: refreshPublicKey });
    result.refreshTokenExpires = moment().add(REFRESH_TOKEN_TTL, 'seconds').toDate();
    refreshTokenData.user = accessTokenData.user;
    await this.redisCacheService.setHashMultiple(refreshPublicKey, refreshTokenData, REFRESH_TOKEN_TTL);
    const accessToken = this.generateAccessToken({ publicKey: accessPublicKey });

    await this.redisCacheService.setHashMultiple(accessPublicKey, accessTokenData, ACCESS_TOKEN_TTL);
    result.accessToken = accessToken;
    result.accessTokenExpires = moment().add(ACCESS_TOKEN_TTL, 'seconds').toDate();
    return result;
  }

  async signUp(payload: SignUpPayload) {
    const { firstName, lastName, userName, birthDate, password } = payload;
    const userExists = await this.userService.getUser({ filter: { userName } });
    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    const { id } = await this.userService.createUser({
      firstName,
      lastName,
      userName,
      birthDate,
      password,
      roles: [UserRole.Customer],
    });
    return {
      id: id,
      firstName,
      lastName,
    };
  }

  async logout(publicKey: string) {
    const redisData: any = await this.redisCacheService.getHashAll(publicKey);
    if (!redisData) {
      throw new TokenExpiredException();
    }
    return this.redisCacheService.delete(publicKey);
  }

  async accessToken(tokenData: any, payload: AccessTokenPayload) {
    const { refreshToken, user: userId } = payload;
    const { user: tokenUser, publicKey: oldPublicKey } = tokenData;
    if (tokenUser.id !== userId) {
      throw new RefreshTokenInvalidException();
    }
    const refreshTokenData = await this.jwtService.verifyAsync(refreshToken).catch((err) => {
      this.logger.error(err);
      if (err.name === TOKEN_EXPIRED_ERROR) {
        throw new TokenExpiredException();
      } else {
        throw new TokenInvalidException();
      }
    });
    const { publicKey } = refreshTokenData;
    const redisData: any = await this.redisCacheService.getHashAll(publicKey);
    if (!redisData) {
      throw new TokenExpiredException();
    }
    if (redisData.user.id !== userId) {
      throw new RefreshTokenInvalidException();
    }
    const user = await this.userService.getUserById(userId, { projection: 'roles firstName lastName userName roles' });
    await this.redisCacheService.delete(oldPublicKey);
    const accessPublicKey = uuidv4();
    const accessTokenData: any = {
      user: { id: userId, firstName: user.firstName, lastName: user.lastName, roles: user.roles },
    };
    accessTokenData.roles = user.roles;
    accessTokenData.endpoints = AuthLogic.getUserEndpointPermissionsFromRoles(user.roles);
    await this.redisCacheService.setHashMultiple(accessPublicKey, accessTokenData, ACCESS_TOKEN_TTL);
    const accessToken = this.generateAccessToken({ publicKey: accessPublicKey });
    const result: any = { user: { id: userId, firstName: user.firstName, lastName: user.lastName }, roles: accessTokenData.roles };
    result.accessToken = accessToken;
    result.accessTokenExpires = moment().add(ACCESS_TOKEN_TTL, 'seconds').toDate();
    await this.redisCacheService.setHash(publicKey, 'accessPublicKey', accessPublicKey);
    return result;
  }

  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_TTL });
  }

  private generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: REFRESH_TOKEN_TTL });
  }
}
