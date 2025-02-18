import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.deviceId = req.headers['device-id'] ? req.headers['device-id'].toString() : null;
    req.deviceType = req.headers['device-type'] ? req.headers['device-type'].toString() : null;
    req.ipAddress = req.headers['ip-address'] ? req.headers['ip-address'].toString() : null;
    req.signature = req.headers['signature'] ? req.headers['signature'].toString() : null;
    req.addFilterMeta = req.headers['add-filter-meta'] ? req.headers['add-filter-meta'].toString() === 'true' : false;
    return next.handle();
  }
}
