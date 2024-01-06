import { JwtPayload as _JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../../enums';

export interface JwtPayload extends _JwtPayload {
  id: number;
  username: string;
  role: UserRole;
}
