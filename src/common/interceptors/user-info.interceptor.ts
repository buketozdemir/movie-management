import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const setUserInfo = (object: any, userId: string): void => {
      if (['POST'].includes(request.method)) {
        object.createdBy = userId;
      } else if (['PUT'].includes(request.method)) {
        object.createdBy = userId;
      } else if (['PATCH'].includes(request.method)) {
        object.updatedBy = userId;
      } else if (['DELETE'].includes(request.method)) {
        object.deletedBy = userId;
      }
    };
    const prepareBody = (object: any, userId: string): void => {
      if (typeof object === 'object' && !Object.keys(object).length) {
        setUserInfo(object, userId);
      } else {
        for (const key in object) {
          if (Array.isArray(object[key]) && object[key].length && typeof object[key][0] === 'string') {
            setUserInfo(object, userId);
          } else if (typeof object[key] === 'object' && object[key] !== null) {
            setUserInfo(object, userId);
            prepareBody(object[key], userId);
          } else {
            setUserInfo(object, userId);
          }
        }
      }
    };
    const request = context.switchToHttp().getRequest();
    if (request.user && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const { id: userId } = request.user;
      prepareBody(request.body, userId);
    }

    return next.handle();
  }
}
