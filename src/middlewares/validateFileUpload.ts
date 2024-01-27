import { NextFunction, Request, Response } from 'express';
import { File } from '../common/constants';
import { ErrorCode } from '../common/enums';
import {
  NotFoundError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
} from '../utils';

export const validateFileUpload =
  (
    options?: Partial<{
      maxSize: number;
      allowedTypes: string[];
    }>,
  ) =>
  ({ files }: Request, _: Response, next: NextFunction) => {
    if (!files.length) {
      throw NotFoundError(ErrorCode.FILE_NOT_FOUND);
    }
    const maxSize = options?.maxSize || File.MAX_SIZE;
    const allowedTypes =
      options?.allowedTypes || Object.values(File.ALLOWED_TYPES);
    (files as Express.Multer.File[]).forEach(({ mimetype, size }) => {
      if (!allowedTypes.includes(mimetype)) {
        throw UnsupportedMediaTypeError(ErrorCode.INVALID_FILE_FORMAT);
      }
      if (size > maxSize) {
        throw PayloadTooLargeError(ErrorCode.FILE_TOO_LARGE);
      }
    });
    next();
  };
