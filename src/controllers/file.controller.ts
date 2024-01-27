import { Router } from 'express';
import multer from 'multer';
import { validateFileUpload } from '../middlewares';

export const fileController = Router();

/**
 * @openapi
 * /file/upload:
 *   post:
 *     tags:
 *       - file
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en-US, vi-VN]
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
  multer().any(),
  validateFileUpload(),
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
