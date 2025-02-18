import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { ErrorResponse } from '../interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let responseBody: ErrorResponse;
    if (exception instanceof BadRequestException) {
      const errorResponse: any = exception.getResponse();
      responseBody = { code: 0, error: typeof errorResponse === 'string' ? errorResponse : errorResponse.error, message: errorResponse.message };
    } else if (exception instanceof HttpException) {
      const errorResponse: any = exception.getResponse();
      responseBody = {
        code: errorResponse.code,
        error: typeof errorResponse === 'string' ? errorResponse : errorResponse.error,
        message: errorResponse.message,
        actions: errorResponse.actions,
      };
    } else {
      responseBody = { code: -1, error: exception.stack, message: exception.message };
      this.logger.error(responseBody);
    }
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // We can send the error to Sentry or any other error tracking service

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
