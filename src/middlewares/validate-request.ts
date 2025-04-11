import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export const validateRequest =
  <T>(
    ...args: { key: 'body' | 'params' | 'query'; value: ClassConstructor<T> }[]
  ) =>
  (req: Request, _: Response, next: NextFunction) => {
    for (const { key, value } of args) {
      req[key] = plainToInstance(value, req[key]);
      const errors = validateSync(req[key], { whitelist: true });
      if (errors.length) {
        next(errors);
        return;
      }
    }
    next();
  };
