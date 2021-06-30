import { handleRequestError } from '../error-handler';
import { HttpException } from '@nestjs/common';

describe('HandleRequestError', () => {
  it('should return http exception', async () => {
    const error = {
      response: {
        data: 'test data',
        status: 404,
      },
    };
    expect(handleRequestError(error)).toEqual(new HttpException(error.response.data, error.response.status));
  });

  it('should do nothing', async () => {
    const error = {
      data: 'test',
    };
    expect(handleRequestError(error)).toEqual(error);
  });
});
