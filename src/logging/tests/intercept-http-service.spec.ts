import { HttpService } from '@nestjs/common';
import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';
import interceptHttpService from '../intercept-http-service';

describe('HttpService logging interceptor', () => {
  it('request and response are intercepted by logger', () => {
    const request = jest.fn();
    const response = jest.fn();
    const info = jest.fn();

    const httpService = {
      axiosRef: {
        interceptors: {
          request: {
            use: request,
          },
          response: {
            use: response,
          },
        },
      },
    } as unknown as HttpService;

    const logger = {
      info,
    } as unknown as WinstonLoggerService;

    interceptHttpService(httpService, logger);
    expect(request).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(response).toHaveBeenNthCalledWith(1, expect.any(Function), expect.any(Function));

    const headers = { 'content-type': 'json' };
    const data = { name: 'test' };
    const method = 'test';
    const url = 'url';

    const req = {
      headers,
      data,
      method,
      url,
    };

    const logRequest = request.mock.calls[0][0];
    logRequest(req);

    expect(info).toHaveBeenCalledWith('TEST url', {
      request: {
        headers,
        body: data,
      },
      tags: {
        method: 'TEST',
        baseUrl: url,
        url,
        type: 'internal-request',
      },
    });

    const logResponse = response.mock.calls[0][0];
    const resHeaders = { x: 'y' };
    const resBody = { value: 12 };
    const status = 200;

    const res = {
      config: {
        ...req,
        startTime: 13,
      },
      headers: resHeaders,
      data: resBody,
      status,
    };

    logResponse(res);

    expect(info).toHaveBeenCalledWith('TEST url', {
      request: {
        headers,
        body: data,
      },
      tags: {
        method: 'TEST',
        baseUrl: url,
        url,
        type: 'internal-response',
      },
      http: {
        status_code: status,
      },
      response: {
        headers: resHeaders,
        body: resBody,
        time: expect.any(Number),
      },
    });
  });
});
