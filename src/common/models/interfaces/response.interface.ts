import { ErrorCode } from '../../enums';

/**
 * @openapi
 * components:
 *   schemas:
 *     ValidationError:
 *       properties:
 *         property:
 *           type: string
 *           example: ''
 *         message:
 *           type: string
 *           example: ''
 */
export interface ValidationError {
  field: string;

  message: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       properties:
 *         code:
 *           type: string
 *           example: ''
 *         message:
 *           type: string
 *           example: ''
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValidationError'
 */
export class Error {
  code: ErrorCode;

  message: string;

  details: ValidationError[];
}

export interface Response<T = any> {
  data: T;

  error: Error;
}
