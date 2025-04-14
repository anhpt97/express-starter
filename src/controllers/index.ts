import { Router } from 'express';
import { join } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { APP_NAME, NODE_ENV } from '../common/constants';
import { NodeEnv } from '../common/enums';
import { authController } from './auth.controller';
import { fileController } from './file.controller';
import { meController } from './me.controller';
import { userController } from './user.controller';

export const router = Router();

const basePath = '/api';
export const apiDocsPath = '/api-docs';

if (NODE_ENV !== NodeEnv.Production) {
  const spec = swaggerJSDoc({
    apis: [
      join(process.cwd(), 'src', 'controllers', 'index.ts'),
      join(process.cwd(), '**', '*.ts'),
    ],
    swaggerDefinition: {
      openapi: '3.0.0',
      info: { title: APP_NAME, version: '' },
      servers: [{ url: basePath }],
    },
  });
  router.get(`${apiDocsPath}.json`, (_, res) => res.json(spec));
  router.use(apiDocsPath, serve, setup(spec));
}

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * /:
 *   get:
 *     servers:
 *       - url: /
 *     tags:
 *       -
 *     summary: Health check
 *     parameters:
 *       - name: Accept-Language
 *         in: header
 *         schema:
 *           type: string
 *           enum: [en, vi]
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

router.use(`${basePath}/auth`, authController);
router.use(`${basePath}/file`, fileController);
router.use(`${basePath}/me`, meController);
router.use(`${basePath}/users`, userController);
