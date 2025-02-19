/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorCode:
 *       type: string
 *       enum:
 *         - DISABLED_USER
 *         - EXPIRED_TOKEN
 *         - FILE_NOT_FOUND
 *         - FILE_TOO_LARGE
 *         - INCORRECT_PASSWORD
 *         - INTERNAL_SERVER_ERROR
 *         - INVALID_FILE_FORMAT
 *         - INVALID_INPUT
 *         - INVALID_TOKEN
 *         - MISSING_JWT_VALIDATION
 *         - PERMISSION_DENIED
 *         - UNACTIVATED_USER
 *         - USER_NOT_FOUND
 */
export enum ErrorCode {
  DISABLED_USER = 'DISABLED_USER',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  MISSING_JWT_VALIDATION = 'MISSING_JWT_VALIDATION',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNACTIVATED_USER = 'UNACTIVATED_USER',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}
