/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationError as _ValidationError } from 'class-validator';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { HttpError } from 'http-errors';
import { t } from 'i18next';
import { iterate } from 'iterare';
import { createLogger, format } from 'winston';
import { File } from 'winston/lib/winston/transports';
import { ErrorCode } from '../common/enums';
import { Response, ValidationError } from '../common/models';

export const errorHandler = (
  error: any,
  req: ExpressRequest,
  res: ExpressResponse,
  _: NextFunction,
) => {
  if (error[0] instanceof _ValidationError) {
    res.status(400).send({
      code: ErrorCode.INVALID_INPUT,
      message: t(ErrorCode.INVALID_INPUT),
      details: transformValidationErrors(error),
    } as Response['error']);
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.statusCode).send({
      code: error.message,
      message: t(error.message),
      details: [],
    } as Response['error']);
    return;
  }
  log({ error, request: req });
  res.status(500).send({ ...error, message: error.toString() });
};

const transformValidationErrors = (
  errors: _ValidationError[],
): ValidationError[] =>
  flattenValidationErrors(errors).map((message) => {
    if (message.includes('each value in ')) {
      message = message.replace(/each value in (nested property )?/, '');
      return {
        field: message.split(' ')[0],
        message: `each value in ${message}`,
      };
    }
    return { field: message.split(' ')[0], message };
  });

const flattenValidationErrors = (errors: _ValidationError[]): string[] =>
  iterate(errors)
    .map((error) => mapChildrenToValidationErrors(error))
    .flatten()
    .filter(({ constraints }) => Boolean(constraints))
    .map(({ constraints }) => Object.values(constraints))
    .flatten()
    .toArray();

const mapChildrenToValidationErrors = (
  error: _ValidationError,
  parentPath?: string,
): _ValidationError[] => {
  if (!error.children.length) {
    return [error];
  }
  const errors = [];
  parentPath = parentPath
    ? `${parentPath}${
        /^(0|[1-9]\d*)$/.test(error.property)
          ? `[${error.property}]`
          : `.${error.property}`
      }`
    : error.property;
  for (const item of error.children) {
    if (item.children.length) {
      errors.push(...mapChildrenToValidationErrors(item, parentPath));
    }
    errors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return errors;
};

const prependConstraintsWithParentProp = (
  parentPath: string,
  error: _ValidationError,
): _ValidationError => {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return { ...error, constraints };
};

const logger = createLogger({
  format: format.printf(
    ({ message }) => `${new Date().toISOString()} — ${message}`,
  ),
  transports: new File({ filename: 'error.log', dirname: 'logs' }),
});

const log = ({
  error,
  request: {
    headers: { authorization, origin },
    ip,
    body,
    method,
    params,
    query,
    originalUrl,
    user,
  },
}: {
  error: Error;
  request: ExpressRequest;
}) =>
  logger.log({
    level: 'error',
    message: JSON.stringify({
      error: JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      ),
      request: {
        body,
        headers: { authorization },
        ip,
        method,
        params,
        query,
        url: `${origin}${originalUrl}`,
        user,
      },
    }),
  });
