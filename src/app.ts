import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dotenv/config';
import express from 'express';
import 'reflect-metadata';
import { PORT } from './common/constants';
import { router } from './controllers';
import { dataSource } from './data-source';
import { errorHandler, i18n, responseWrapper } from './middlewares';
// import './task-scheduler';

dayjs.extend(customParseFormat);

export const app = express();

app.use(express.json(), i18n, responseWrapper, router, errorHandler);

void (async () => {
  await dataSource.initialize();
  app.listen(PORT);
})();
