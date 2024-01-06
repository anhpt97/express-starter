import { JwtPayload } from '../common/models';
import { userRepository } from '../repositories';

const whoAmI = ({ id }: JwtPayload) =>
  userRepository.findOne({ where: { id } }, true);

export const meService = {
  whoAmI,
};
