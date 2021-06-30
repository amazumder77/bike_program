import * as _ from 'lodash';
import * as http from 'http';
import * as https from 'https';
import * as url from 'url';

import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';
import parseOutboundData from './logger-parser';
import { sensitiveFields } from './config';

/**
 * Wraps http and https modules to make them log every outbound request
 *
 * Basically entire code taken from https://github.com/meetearnest/global-request-logger/blob/master/index.js
 */

interface Originals {
  http: {
    request: typeof http.request;
  };
  https: {
    request: typeof https.request;
  };
}

interface LogInfo {
  request: any;
  response: any;
  tags: {
    method: string;
    protocol: string;
    url: string;
    type: string;
    operation: string;
    graphql_node: string;
  };
  http: {
    status_code: number;
  };
  timestamp: string;
}

interface OutboundLoggerOptions {
  maxBodyLength?: number;
}

type RequestOptions = string | http.RequestOptions | url.URL;

class OutboundLogger {
  originals: Originals;
  http: typeof http;
  https: typeof https;
  maxBodyLength: number;
  logger: WinstonLoggerService;

  constructor(httpModule: typeof http, httpsModule: typeof https) {
    this.originals = {
      http: _.pick(httpModule, 'request'),
      https: _.pick(httpsModule, 'request'),
    };
    this.http = httpModule;
    this.https = httpsModule;
    this.logger = new WinstonLoggerService(undefined, {
      sensitiveFields,
    });
  }

  initialize(options?: OutboundLoggerOptions): void {
    // There is an issue that logs doesn't work until you redefine "get" function of a module
    // For now used this solution, to solve this issue
    // https://github.com/meetearnest/global-request-logger/issues/13#issuecomment-408273125
    // https://github.com/nodejs/node/blob/master/lib/http.js#L44
    ['http', 'https'].forEach((protocol) => {
      this[protocol].get = (opts, callback) => {
        const request = this[protocol].request(opts, callback);
        request.end();
        return request;
      };
    });

    options = options || {};
    _.defaults(options, {
      maxBodyLength: 1024 * 1000 * 3,
    });
    this.maxBodyLength = options.maxBodyLength;

    try {
      this.saveRequestFunctions();
      this.http.request = this.attachLoggersToRequest.bind(this.http, this, 'http');
      this.https.request = this.attachLoggersToRequest.bind(this.https, this, 'https');
    } catch (error) {
      this.resetRequestFunctions();
      throw error;
    }
  }

  saveRequestFunctions(): void {
    this.originals = {
      http: _.pick(this.http, 'request'),
      https: _.pick(this.https, 'request'),
    };
  }

  resetRequestFunctions(): void {
    _.assign(this.http, this.originals.http);
    _.assign(this.https, this.originals.https);
  }

  attachLoggersToRequest(
    context: OutboundLogger,
    protocol: 'http' | 'https',
    options?: RequestOptions,
    callback?: () => void,
  ): any {
    const request = context.originals[protocol].request.call(this, options, callback);

    // Extract request logging details
    let path = '';
    if (typeof options === 'string') {
      options = url.parse(options);
      path = options.path;
    }
    if ((options as any).toJSON && typeof (options as any).toJSON === 'function') {
      path = (options as url.URL).pathname;
    }

    if (options.port === '8126') {
      return request;
    }

    const title = `${request.method} ${options.host || options.hostname}${path}`;
    const logInfo: LogInfo = context.createLogInfo(request, options);

    const requestData = [];
    const responseData = [];
    const originalWrite = request.write;

    request.write = (...args: Array<number>): void => {
      context.logBodyChunk(requestData, args);
      originalWrite.apply(request, args);
    };
    request.on('error', (error: Error): void => {
      logInfo.request.error = error;
      context.logger.error('An error accured during the outbound request', error);
    });
    request.on('response', (response: http.IncomingMessage): void => {
      logInfo.http.status_code = response.statusCode;

      const requestBody = requestData.join('');

      logInfo.request.body = requestBody ? parseOutboundData(requestBody) : requestBody;
      _.assign(logInfo.response, _.pick(response, 'headers'));
      response.on('data', (data: Array<number>): void => {
        context.logBodyChunk(responseData, data);
      });
      response.on('end', (): void => {
        const responseBody = responseData.join('');

        logInfo.response.body = responseBody ? parseOutboundData(responseBody) : responseBody;

        context.logger.info(title, logInfo);
      });
      response.on('error', (error: Error): void => {
        logInfo.response.error = error;
        context.logger.error('An error accured during the outbound request', error);
      });
    });

    return request;
  }

  createLogInfo(request: any, options: http.RequestOptions): LogInfo {
    const logInfo: LogInfo = {
      http: {
        status_code: 200, // Default to 200 for INFO logs. Updated on response
      },
      request: {},
      response: {},
      tags: {
        method: request.method,
        protocol: options.protocol,
        url: options.path,
        type: 'outbound request',
        operation: 'REST',
        graphql_node: '',
      },
      timestamp: new Date().toJSON(),
    };

    logInfo.request.headers = request._headers;

    return logInfo;
  }

  logBodyChunk(array: Array<any>, chunk: Array<number>): void {
    if (chunk) {
      let toAdd = chunk;
      const newLength = array.length + chunk.length;
      if (newLength > this.maxBodyLength) {
        toAdd = chunk.slice(0, this.maxBodyLength - newLength);
      }
      array.push(toAdd);
    }
  }

  end(): void {
    this.resetRequestFunctions();
  }
}

export const outboundLogger = new OutboundLogger(http, https);
