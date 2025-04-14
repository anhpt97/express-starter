import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, InternalServerError } from '../common/constants';
import { ErrorCode, UserRole } from '../common/enums';

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
