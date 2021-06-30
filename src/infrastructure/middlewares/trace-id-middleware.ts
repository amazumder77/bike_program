import * as Sentry from '@sentry/node';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';
import { v4 } from 'uuid';

@Injectable()
export class TraceIDMiddleware implements NestMiddleware {
  constructor(private logger: WinstonLoggerService) {}
  use(req: Request, _: Response, next: NextFunction): void {
    const traceID: string = (req.headers['hqo-trace-id'] as string) || v4();
    const whitelistedPaths = new Set(['/', '/healthcheck']);
    if (!req.headers['hqo-trace-id'] && !whitelistedPaths.has(req.path)) {
      this.logger.error('Request is missing trace id', {
        headers: req.headers,
        url: req.url,
      });
    }

    Sentry.configureScope((scope) => scope.setTag('hqo-trace-id', traceID));

    next();
  }
}

export default TraceIDMiddleware;
