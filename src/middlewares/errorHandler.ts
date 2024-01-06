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
import { ErrorCode } from '../common/enums';
import { Error, ValidationError } from '../common/models';

export const errorHandler = (
  error: any,
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (error[0] instanceof _ValidationError) {
    res.status(400).send({
      code: ErrorCode.INVALID_INPUT,
      message: t(ErrorCode.INVALID_INPUT),
      details: transformValidationErrors(error),
    } as Error);
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.statusCode).send({
      code: error.message,
      message: t(error.message),
      details: [],
    } as Error);
    return;
  }
  res.status(500).send({ message: error.toString(), ...error });
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
