import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { Response } from '../common/models';

export const responseInterceptor = (
  _: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const { send } = res;
  res.send = (response) => {
    res.send = send;
    return typeof response === 'string'
      ? res.send(response)
      : res.json(
          (response instanceof Error
            ? { error: response }
            : { data: response }) as Response,
        );
  };
  next();
};
