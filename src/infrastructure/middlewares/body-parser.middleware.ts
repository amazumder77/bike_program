import { NextFunction, Request, Response } from 'express';

import { NestMiddleware } from '@nestjs/common';
import { REQUEST_MAX_SIZE } from '../app-configuration.consts';
// @ts-ignore
import bodyParser from 'body-parser';

export class BodyParserMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction): void {
    bodyParser?.json({
      limit: REQUEST_MAX_SIZE,
    });
    next();
  }
}
