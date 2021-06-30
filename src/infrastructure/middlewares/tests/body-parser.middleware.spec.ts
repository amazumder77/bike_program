import { Request, Response } from 'express';

import { BodyParserMiddleware } from '../body-parser.middleware';

jest.mock('uuid');
jest.mock('@sentry/node');
describe('Body parser middleware', () => {
  let response: jest.Mock;
  let next: jest.Mock;

  beforeAll(() => {
    response = jest.fn();
    next = jest.fn();
  });

  it('should parse body to json', () => {
    const request = {
      headers: {},
      path: '',
    } as Request;

    const middleware = new BodyParserMiddleware();
    middleware.use(request, response as unknown as Response, next);

    expect(next).toBeCalled();
  });
});
