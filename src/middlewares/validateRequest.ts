import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export const validateRequest =
  <T>(
    ...args: { key: 'body' | 'params' | 'query'; dto: ClassConstructor<T> }[]
  ) =>
  (req: Request, _: Response, next: NextFunction) => {
    for (const { key, dto } of args) {
      req[key] = plainToInstance(dto, req[key]);
      const errors = validateSync(req[key], { whitelist: true });
      if (errors.length) {
        next(errors);
        return;
      }
    }
    next();
  };
