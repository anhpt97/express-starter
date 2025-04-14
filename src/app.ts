import cluster from 'cluster';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dotenv/config';
import express from 'express';
import { availableParallelism } from 'os';
import 'reflect-metadata';
import { PORT } from './common/constants';
import { router } from './controllers';
import { dataSource } from './data-source';
import { errorHandler, i18n, responseWrapper } from './middlewares';
// import './task-scheduler';

dayjs.extend(customParseFormat);

export const app = express();

app.use(express.json(), i18n, responseWrapper, router, errorHandler);

const bootstrap = async () => {
  try {
    await dataSource.initialize();
    app.listen(PORT);
  } catch {
    process.exit();
  }
};

if (cluster.isPrimary) {
  [...Array(availableParallelism())].forEach((_, i) =>
    cluster.fork({ NODE_APP_INSTANCE: i }),
  );
} else {
  void bootstrap();
}
