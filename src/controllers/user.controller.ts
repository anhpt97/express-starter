import { Router } from 'express';
import { paginate } from '../middlewares';
import { userService } from '../services';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - users
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en-US, vi-VN]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           example: 1
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       - in: query
 *         name: sort
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"id":"DESC"}
 *     responses:
 *       2XX:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: number
 */
router.get('/', paginate(), async ({ query }, res, next) => {
  try {
    res.send(await userService.getList(query));
  } catch (error) {
    next(error);
  }
});

export const userController = router;
