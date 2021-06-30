import { Response } from 'express';

export interface ResponseLogData {
  response: Response;
  body: unknown;
  time: number;
}
