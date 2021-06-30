import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import isLoggableUrl, { getBasePath } from './config';

import { ResponseLogData } from './interfaces/response-log-data.interface';
import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';

type ResWriteParameters = Parameters<Response['write']>;
type ResEndParameters = Parameters<Response['end']>;

@Injectable()
export default class ResponseLoggerMiddleware implements NestMiddleware {
  constructor(private winstonLoggerService: WinstonLoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    if (isLoggableUrl(request.baseUrl)) {
      const startAt = process.hrtime(); // Time request first entered the middleware
      const responseEnd = response.end;
      const responseWrite = response.write;
      const chunks: Array<Uint8Array> = [];

      response.write = (...restArgs: Array<unknown>): boolean => {
        chunks.push(Buffer.from(restArgs[0] as ArrayBuffer));
        responseWrite.apply(response, restArgs as ResWriteParameters);

        return true;
      };

      response.end = (...restArgs: Array<unknown>): void => {
        ResponseLoggerMiddleware.modifyChunk(chunks, restArgs);

        const responseBodyString = Buffer.concat(chunks).toString('utf8');

        const responseLogData = this.generateResponseLogData(response, responseBodyString, startAt);
        this.logResponse(request, responseLogData, responseBodyString);

        responseEnd.apply(response, restArgs as ResEndParameters);
      };
    }

    next();
  }

  getResponseTimeInMs(responseStartTime: [number, number]): number {
    const nanosecondsPerSeconds = 1e9;
    const nanosecondsToMilliSeconds = 1e6;
    const [seconds, nanoseconds] = process.hrtime(responseStartTime);

    return (seconds * nanosecondsPerSeconds + nanoseconds) / nanosecondsToMilliSeconds;
  }

  safeParseJson(json: string): unknown | null {
    try {
      if (!json) {
        return null;
      }

      return JSON.parse(json);
    } catch (err) {
      this.winstonLoggerService.warn('Failed to parse response json', {
        err,
        json,
      });

      return null;
    }
  }

  logResponseInfo(request: Request, responseLogData: ResponseLogData): void {
    this.winstonLoggerService.info(`${request.method} ${request.originalUrl}`, {
      http: {
        status_code: responseLogData.response.statusCode,
      },
      request: {
        headers: request.headers,
        body: request.body,
        user: request.user ?? null,
      },
      response: {
        headers: responseLogData.response.getHeaders(),
        body: responseLogData.body,
        time: responseLogData.time,
      },
      tags: {
        method: request.method,
        baseUrl: getBasePath(request.originalUrl),
        url: request.originalUrl,
        type: 'response',
      },
    });
  }

  private generateResponseLogData(
    response: Response,
    responseBodyString: string,
    startAt: [number, number],
  ): ResponseLogData {
    return {
      response,
      body: this.safeParseJson(responseBodyString) || responseBodyString,
      time: this.getResponseTimeInMs(startAt),
    };
  }

  private static modifyChunk(chunks: Array<Uint8Array>, restArgs: Array<unknown>): void {
    if (restArgs?.[0]) {
      chunks.push(Buffer.from(restArgs[0] as ArrayBuffer));
    }
  }

  private logResponse(request: Request, responseLogData: ResponseLogData, responseBodyString: string): void {
    const maxResponseLength = 204800;

    // If the response body is over 200kb, log it separately
    // so that DD will process the request log with facets etc.
    if (responseBodyString.length > maxResponseLength) {
      this.winstonLoggerService.info(responseBodyString);
    }

    this.logResponseInfo(request, responseLogData);
  }
}
