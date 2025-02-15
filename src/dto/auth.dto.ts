import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginDto:
 *       properties:
 *         username:
 *           type: string
 *           example: superadmin
 *         password:
 *           type: string
 *           example: 123456
 */
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
