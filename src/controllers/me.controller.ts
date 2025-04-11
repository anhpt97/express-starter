import { Router } from 'express';
import { validateJwt } from '../middlewares';
import { meService } from '../services';

const router = Router();

/**
 * @openapi
 * /me:
 *   get:
 *     tags:
 *       - me
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       2XX:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/', validateJwt, async ({ user }, res, next) => {
  try {
    res.send(await meService.whoAmI(user!));
  } catch (error) {
    next(error);
  }
});

export const meController = router;
