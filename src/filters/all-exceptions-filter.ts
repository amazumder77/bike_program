import * as Sentry from '@sentry/node';

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    // Try to get Request and Response objects from a REST call
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    Sentry.captureException(exception);

    const status =
      typeof exception.getStatus === 'function' ? exception.getStatus() : exception.status || exception.statusCode;
    response.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        code: status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.response ?? exception.message,
        detail: exception.detail ?? exception.name,
        trid: request.query?.trid,
      },
    });
  }
}
