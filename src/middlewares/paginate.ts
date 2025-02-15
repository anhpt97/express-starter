import { NextFunction, Response } from 'express';
import { SortDirection } from '../common/enums';
import { PaginationQuery } from '../common/models';

export const paginate =
  (
    options?: Partial<{
      defaultLimit: PaginationQuery['limit'];
      maxLimit: PaginationQuery['limit'];
      defaultSort: PaginationQuery['sort'];
    }>,
  ) =>
  (req: { query: PaginationQuery }, _: Response, next: NextFunction) => {
    const defaultLimit = options?.defaultLimit || 10;
    const maxLimit = options?.maxLimit || 100;
    const defaultSort = options?.defaultSort || {
      by: 'id',
      direction: SortDirection.DESC,
    };

    const { limit, page, filter, sort: _sort } = req.query;

    req.query.limit = Math.min(Number(limit) || defaultLimit, maxLimit);

    req.query.page = Number(page) || 1;

    try {
      req.query.filter = JSON.parse(decodeURIComponent(filter as any));
    } catch {
      req.query.filter = {};
    }

    try {
      const sort: typeof _sort = JSON.parse(_sort as any);
      req.query.sort =
        sort.by &&
        Object.values(SortDirection).includes(
          sort.direction.trim().toUpperCase() as SortDirection,
        )
          ? sort
          : defaultSort;
    } catch {
      req.query.sort = defaultSort;
    }

    next();
  };
