import { JwtPayload } from '../common/models';
import { userRepository } from '../repositories';

const whoAmI = (user: JwtPayload) =>
  userRepository.findOne({ where: { id: user.id } }, true);

export const meService = {
  whoAmI,
};
