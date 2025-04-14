import { PaginatedDto } from '../common/dto';
import { PaginationQuery } from '../common/models';
import { userRepository } from '../repositories';

const getById = (id: string) => userRepository.findOne({ where: { id } });

const paginate = async ({ limit, page, sort }: PaginationQuery) => {
  const [users, count] = await userRepository
    .createQueryBuilder('user')
    .orderBy(sort.by, sort.direction)
    .take(limit)
    .skip(limit * (page - 1))
    .getManyAndCount();
  return new PaginatedDto({ results: users, total: count });
};

export const userService = {
  getById,
  paginate,
};
