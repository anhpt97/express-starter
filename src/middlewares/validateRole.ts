import { NextFunction, Request, Response } from 'express';
import { ErrorCode, UserRole } from '../common/enums';
import { ForbiddenError, InternalServerError } from '../utils';

export const validateRole =
  (...roles: UserRole[]) =>
  ({ user }: Request, _: Response, next: NextFunction) => {
    if (!user) {
      throw InternalServerError(ErrorCode.MISSING_JWT_VALIDATION);
    }
    if (!roles.includes(user.role)) {
      throw ForbiddenError(ErrorCode.PERMISSION_DENIED);
    }
    next();
  };
