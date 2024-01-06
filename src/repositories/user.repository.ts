import { FindOneOptions } from 'typeorm';
import { ErrorCode, UserStatus } from '../common/enums';
import { dataSource } from '../data-source';
import { User } from '../entities';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../utils';

export const userRepository = dataSource.getRepository(User).extend({
  async findOne(options: FindOneOptions<User>, validateStatus = false) {
    const select = options.select as (keyof User)[];
    if (select && !select.includes('status')) {
      select.push('status');
    }
    const user = await dataSource.getRepository(User).findOne(options);
    if (!user) {
      throw NotFoundError(ErrorCode.USER_NOT_FOUND);
    }
    if (validateStatus) {
      if (user.status === UserStatus.UNACTIVATED) {
        throw UnauthorizedError(ErrorCode.UNACTIVATED_USER);
      }
      if (user.status === UserStatus.DISABLED) {
        throw ForbiddenError(ErrorCode.DISABLED_USER);
      }
    }
    return user;
  },
});
