import { PaginatedDto } from '../common/dto';
import { PaginationQuery } from '../common/models';
import { userRepository } from '../repositories';

const getList = async ({ limit, page, sort }: PaginationQuery) => {
  const [users, total] = await userRepository
    .createQueryBuilder('user')
    .orderBy(sort.by, sort.direction)
    .take(limit)
    .skip(limit * (page - 1))
    .getManyAndCount();
  return new PaginatedDto(users, total);
};

export const userService = {
  getList,
};
