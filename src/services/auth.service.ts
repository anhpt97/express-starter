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
  const user = await userRepository.findOne(
    {
      select: ['id', 'username', 'hashedPassword', 'role'],
      where: [{ username }, { email: username }],
    },
    true,
  );
  if (!compareSync(password, user.hashedPassword)) {
    throw BadRequestError(ErrorCode.INCORRECT_PASSWORD);
  }
  return {
    accessToken: sign(
      { id: user.id, username: user.username, role: user.role } as JwtPayload,
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXP_TIME },
    ),
  };
};

export const authService = {
  login,
};
