import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  BadRequestError,
  JWT_EXP_TIME,
  JWT_SECRET_KEY,
} from '../common/constants';
import { ErrorCode } from '../common/enums';
import { JwtPayload } from '../common/models';
import { LoginDto } from '../dto';
import { userRepository } from '../repositories';

const login = async ({ username, password }: LoginDto) => {
  const { id, hashedPassword, role } = await userRepository.findOne(
    {
      select: ['id', 'hashedPassword', 'role'],
      where: [{ username }, { email: username }],
    },
    true,
  );
  if (!compareSync(password, hashedPassword)) {
    throw BadRequestError(ErrorCode.INCORRECT_PASSWORD);
  }
  return {
    accessToken: sign({ id, role } as JwtPayload, JWT_SECRET_KEY, {
      expiresIn: JWT_EXP_TIME,
    }),
  };
};

export const authService = {
  login,
};
