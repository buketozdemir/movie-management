import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PAGINATION } from '../constants';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  constructor(private path?: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const isPaginatedClass = this.path && this.path !== '' ? this.isPaginatedClass() : true;

    if (isPaginatedClass) {
      request.query.page = request.query.page || PAGINATION.DEFAULT_PAGE;
      request.query.limit = request.query.limit || PAGINATION.DEFAULT_LIMIT;
    }

    return next.handle();
  }

  private isPaginatedClass(): boolean {
    const splitPath = this.path.split('/');
    return splitPath.length === 1 || !splitPath[splitPath.length - 1].includes(':');
  }
}
