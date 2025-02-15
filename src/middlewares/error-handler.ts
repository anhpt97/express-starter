import { ValidationError as _ValidationError } from 'class-validator';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { HttpError } from 'http-errors';
import { t } from 'i18next';
import { createLogger, format } from 'winston';
import { File } from 'winston/lib/winston/transports';
import { NODE_ENV } from '../common/constants';
import { ErrorCode, NodeEnv } from '../common/enums';
import { Error } from '../common/models';

export const errorHandler = (
  error: any,
  req: ExpressRequest,
  res: ExpressResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction,
) => {
  if (error[0] instanceof _ValidationError) {
    res.status(400).send(
      new Error({
        code: ErrorCode.INVALID_INPUT,
        message: t(ErrorCode.INVALID_INPUT),
        details: handleValidationErrors(error),
      }),
    );
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).send(
      new Error({
        code: error.message as ErrorCode,
        message: t(error.message),
        details: [],
      }),
    );
    return;
  }

  log({ error, request: req });

  res.status(500).send(
    NODE_ENV === NodeEnv.Production
      ? new Error({
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: t(ErrorCode.INTERNAL_SERVER_ERROR),
          details: [],
        })
      : new Error({
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          ...error,
          message: error.toString(),
        }),
  );
};

const handleValidationErrors = (errors: _ValidationError[]) => {
  const arr: string[] = [];
  flattenValidationErrors(arr, errors);
  return arr.map((message) => {
    if (message.includes('each value in ')) {
      message = message.replace(/each value in (nested property )?/, '');
      return {
        field: message.split(' ')[0],
        message: `each value in ${message}`,
      };
    }
    return { field: message.split(' ')[0], message };
  });
};

const flattenValidationErrors = (
  arr: string[],
  errors: _ValidationError[],
  parentPath?: string,
) => {
  for (const { property, constraints, children } of errors) {
    if (!children?.length) {
      if (constraints) {
        arr.push(...Object.values(constraints));
      }
    } else {
      const currentPath = parentPath
        ? `${parentPath}${/0|[1-9]\d*/.test(property) ? `[${property}]` : `.${property}`}`
        : property;
      for (const child of children) {
        if (child.children?.length) {
          flattenValidationErrors(arr, [child], currentPath);
        }
        if (child.constraints) {
          const constraints: Record<string, string> = {};
          for (const key in child.constraints) {
            constraints[key] = `${currentPath}.${child.constraints[key]}`;
          }
          arr.push(...Object.values(constraints));
        }
      }
    }
  }
};

const logger = createLogger({
  format: format.printf(
    ({ message }) => `${new Date().toISOString()} — ${message as string}`,
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
