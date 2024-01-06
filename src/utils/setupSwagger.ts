import { Router } from 'express';
import { join } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { APP_NAME } from '../common/constants';

export const setupSwagger = (basePath: string, router: Router) => {
  const openapiSpecification = swaggerJSDoc({
    apis: [
      join(process.cwd(), 'src', 'controllers', 'index.ts'),
      join(process.cwd(), '**', '*.ts'),
    ],
    swaggerDefinition: {
      openapi: '3.1.0',
      info: { title: APP_NAME, version: '1.0.0' },
      servers: [{ url: basePath }],
    },
  });
  router.get('/swagger.json', (_, res) => res.json(openapiSpecification));
  router.use('/api-docs', serve, setup(openapiSpecification));
};
