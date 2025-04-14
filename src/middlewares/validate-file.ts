import { NextFunction, Request, Response } from 'express';
import {
  NotFoundError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
} from '../common/constants';
import { ErrorCode, FileType } from '../common/enums';

export const validateFile =
  (
    options?: Partial<{
      allowedTypes: string[];
      maxSize: number;
    }>,
  ) =>
  ({ files }: Request, _: Response, next: NextFunction) => {
    if (!files?.length) {
      throw NotFoundError(ErrorCode.FILE_NOT_FOUND);
    }
    const allowedTypes = options?.allowedTypes || Object.values(FileType);
    const maxSize = options?.maxSize || 10485760; // 10 MiB
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
