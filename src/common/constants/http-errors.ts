import createHttpError from 'http-errors';

export const BadRequestError = (message: string) =>
  createHttpError(400, message);

export const UnauthorizedError = (message: string) =>
  createHttpError(401, message);

export const ForbiddenError = (message: string) =>
  createHttpError(403, message);

export const NotFoundError = (message: string) => createHttpError(404, message);

export const PayloadTooLargeError = (message: string) =>
  createHttpError(413, message);

export const UnsupportedMediaTypeError = (message: string) =>
  createHttpError(415, message);

export const TooManyRequestsError = (message: string) =>
  createHttpError(429, message);

export const InternalServerError = (message: string) =>
  createHttpError(500, message);
