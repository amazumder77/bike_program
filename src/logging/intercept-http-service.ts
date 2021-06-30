import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { HttpService } from '@nestjs/common';
import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';

interface StartRequestInfo {
  startTime: number;
}

interface RequestInfo {
  method: string | undefined;
  url: string | undefined;
  requestInfo: Record<string, unknown>;
}

function getRequestInfo(req: AxiosRequestConfig, type = 'internal-request'): RequestInfo {
  const { headers, data: body, method: rawMethod, url } = req;

  const method = rawMethod?.toUpperCase();

  return {
    method,
    url,
    requestInfo: {
      request: {
        headers,
        body,
      },
      tags: {
        method,
        baseUrl: url,
        url,
        type,
      },
    },
  };
}

function logRequest(req: AxiosRequestConfig, logger: WinstonLoggerService): void {
  (req as StartRequestInfo).startTime = Date.now();

  const { method, url, requestInfo } = getRequestInfo(req);

  logger.info(`${method} ${url}`, requestInfo);
}

function logResponse(res: AxiosResponse, logger: WinstonLoggerService, type = 'internal-response'): void {
  const { startTime } = res.config as StartRequestInfo;
  const time = Date.now() - startTime;

  const { method, url, requestInfo } = getRequestInfo(res.config, type);

  const { status, headers, data: body } = res;

  logger.info(`${method} ${url}`, {
    ...requestInfo,
    http: {
      status_code: status,
    },
    response: {
      headers,
      body,
      time,
    },
  });
}

export default function interceptHttpService(httpService: HttpService, logger: WinstonLoggerService): void {
  const { axiosRef } = httpService;

  if (axiosRef !== undefined) {
    const {
      interceptors: { request, response },
    } = axiosRef;

    request.use((req) => {
      logRequest(req, logger);

      return req;
    });

    response.use(
      (res) => {
        logResponse(res, logger);

        return res;
      },
      (error) => {
        logResponse(error, logger, 'internal-response-error');

        return error;
      },
    );
  }
}
