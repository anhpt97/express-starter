import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY, UnauthorizedError } from '../common/constants';
import { ErrorCode } from '../common/enums';
import { JwtPayload } from '../common/models';

export const validateJwt = (req: Request, _: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    throw UnauthorizedError(ErrorCode.INVALID_TOKEN);
  }
  try {
    req.user = verify(
      req.headers.authorization.replace('Bearer ', ''),
      JWT_SECRET_KEY,
    ) as JwtPayload;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw UnauthorizedError(ErrorCode.EXPIRED_TOKEN);
    }
    throw UnauthorizedError(ErrorCode.INVALID_TOKEN);
  }
};
