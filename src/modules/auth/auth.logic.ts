import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { UserRole } from '../../common/enums';
import { PERMISSIONS } from '../../common/constants/permissions';

@Injectable()
class AuthLogic {
  logger = new Logger(AuthLogic.name);

  constructor(private readonly jwtService: JwtService) {}

  async createToken(data, ttl: number): Promise<string> {
    return this.jwtService.sign(data, { expiresIn: ttl });
  }

  async decryptToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  // eslint-disable-next-line class-methods-use-this
  isEmail(value: string): boolean {
    return new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm').test(value);
  }

  generateOTPCode(): number {
    this.logger.debug('OTP Code generating...');
    return Math.floor(Math.random() * 111111 + 100000);
  }

  getNewDateWithExtraMinutes(minute: number): Date {
    this.logger.debug('getNewDateWithExtraMinutes called...');
    return moment(new Date()).add(minute, 'm').toDate();
  }

  static getUserEndpointPermissionsFromRoles(roles: UserRole[]) {
    const permissions = [];
    for (const role of roles) {
      permissions.push(...this.getEndpointPermissionsFromRole(role));
    }
    return permissions;
  }

  private static getEndpointPermissionsFromRole(role: UserRole) {
    switch (role) {
      case UserRole.Customer:
        return PERMISSIONS.CUSTOMER_ENDPOINTS;
      case UserRole.Manager:
        return PERMISSIONS.MANAGER_ENDPOINTS;
      default:
        return PERMISSIONS.CUSTOMER_ENDPOINTS;
    }
  }

  static getPermissionsAndEndpoints(items) {
    const permissions = {};
    const endpoints = {};
    for (const item of items) {
      permissions[item.code] = item.name;
      for (const endpoint of item.endpoints) {
        endpoints[endpoint.method + ':' + endpoint.path] = true;
      }
    }
    return {
      permissions,
      endpoints,
    };
  }

  static uuidValidateV4(uuid: string) {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
  }
}

export default AuthLogic;
