import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import RequestLoggerMiddleware from './request-logger.middleware';
import ResponseLoggerMiddleware from './response-logger.middleware';
import { WinstonLoggerModule } from '@hqo/nestjs-winston-logger';
import { sensitiveFields } from './config';

@Module({
  imports: [
    WinstonLoggerModule.register({
      sensitiveFields,
    }),
  ],
})
export default class LoggingModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLoggerMiddleware, ResponseLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
