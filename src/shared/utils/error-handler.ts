import { HttpException } from '@nestjs/common';

interface RequestException {
  response: {
    data: any;
    status: any;
  };
}

export function handleRequestError(error: RequestException | any): unknown {
  if (error?.response) {
    // We expect that response contains the error object in such case and throw it.
    return new HttpException(error?.response?.data, error?.response?.status);
  }
  return error;
}
