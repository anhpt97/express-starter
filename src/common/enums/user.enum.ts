/**
 * @openapi
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [ADMIN, USER]
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UserStatus:
 *       type: string
 *       enum: [UNACTIVATED, ACTIVE, SUSPENDED]
 */
export enum UserStatus {
  UNACTIVATED = 'UNACTIVATED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}
