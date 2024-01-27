import 'dotenv/config';
import express from 'express';
import { PORT } from './common/constants';
import { router } from './controllers';
import { dataSource } from './data-source';
import { errorHandler, i18n } from './middlewares';

export const app = express();

app.use(express.json());

app.use(i18n);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
app.use('/', router);

app.use(errorHandler);

void (async () => {
  await dataSource.initialize();
  app.listen(PORT);
})();
