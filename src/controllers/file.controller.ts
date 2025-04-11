import { Router } from 'express';
import multer from 'multer';
import { validateFile } from '../middlewares';

export const fileController = Router();

/**
 * @openapi
 * /file/upload:
 *   post:
 *     tags:
 *       - file
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       2XX:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   type: boolean
 *                   example: true
 */
fileController.post(
  '/upload',
  // @ts-ignore
  multer().any(),
  validateFile(),
  ({ files }, res, next) => {
    try {
      // eslint-disable-next-line no-console
      console.log(files);
      res.send(true);
    } catch (error) {
      next(error);
    }
  },
);
