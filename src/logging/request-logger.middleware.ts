import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import isLoggableUrl, { getBasePath } from './config';

import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';

@Injectable()
export default class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private winstonLoggerService: WinstonLoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    if (isLoggableUrl(req.baseUrl)) {
      this.winstonLoggerService.info(`${req.method} ${req.originalUrl}`, {
        request: {
          headers: req.headers,
          body: req.body,
          user: req.user ?? null,
        },
        response: {
          headers: res.getHeaders(),
        },
        tags: {
          method: req.method,
          baseUrl: getBasePath(req.originalUrl ?? ''),
          url: req.originalUrl,
          type: 'request',
        },
      });
    }

    next();
  }
}
