import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { Error, Response } from '../common/models';
import { apiDocsPath } from '../controllers';

export const responseWrapper = (
  { originalUrl }: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (!originalUrl.includes(apiDocsPath)) {
    const { send } = res;
    res.send = (response) => {
      res.send = send;
      return res.json(
        (response instanceof Error
          ? { error: response }
          : { data: response }) as Response,
      );
    };
  }
  next();
};
