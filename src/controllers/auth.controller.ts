import { Router } from 'express';
import { LoginDto } from '../dto';
import { validateRequest } from '../middlewares';
import { authService } from '../services';

export const authController = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en-US, vi-VN]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       2XX:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: ''
 */
authController.post(
  '/login',
  validateRequest({ key: 'body', dto: LoginDto }),
  async ({ body }, res, next) => {
    try {
      res.send(await authService.login(body));
    } catch (error) {
      next(error);
    }
  },
);
