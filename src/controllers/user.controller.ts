import { Router } from 'express';
import { Params } from '../common/dto';
import { paginate, validateRequest } from '../middlewares';
import { userService } from '../services';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - users
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: string
 *           example: 10
 *       - name: page
 *         in: query
 *         schema:
 *           type: string
 *           example: 1
 *       - name: keyword
 *         in: query
 *         schema:
 *           type: string
 *       - name: filter
 *         in: query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       - name: sort
 *         in: query
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
    res.send(await userService.paginate(query));
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       2XX:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get(
  '/:id',
  validateRequest({ key: 'params', value: Params }),
  async ({ params: { id } }, res, next) => {
    try {
      res.send(await userService.getById(id));
    } catch (error) {
      next(error);
    }
  },
);

export const userController = router;
