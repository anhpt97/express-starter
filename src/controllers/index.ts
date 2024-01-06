import { Router } from 'express';
import { responseInterceptor } from '../middlewares';
import { setupSwagger } from '../utils';
import { authController } from './auth.controller';
import { fileController } from './file.controller';
import { meController } from './me.controller';
import { userController } from './user.controller';

const basePath = '/api';

export const router = Router();

setupSwagger(basePath, router);

/**
 * @openapi
 * /:
 *   get:
 *     servers:
 *       - url: /
 *     tags:
 *       -
 *     summary: Health check
 *     responses:
 *       2XX:
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 *       4XX:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   $ref: '#/components/schemas/Error'
 */
router.get('/', (_, res) => {
  res.sendStatus(200);
});

router.use(
  basePath,
  router.use('/auth', authController),
  router.use('/file', fileController),
  router.use('/me', meController),
  router.use('/users', userController),
  router.use(responseInterceptor),
);
