import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenValidatorLogic {
  static getTokenFromRequest(request: any) {
    const headers: { [key: string]: string } = request?.headers;
    if (!request?.headers?.authorization) return undefined;
    const [type, key] = headers.authorization.split(' ');
    if (!type || !key || type !== 'Bearer') return undefined;
    return key;
  }

  static getTokenFromSocket(client: any) {
    const headers: { [key: string]: string } = client?.handshake.headers;
    if (!headers?.authorization) return undefined;
    const [type, key] = headers.authorization.split(' ');
    if (!type || !key || type !== 'Bearer') return undefined;
    return key;
  }
}
