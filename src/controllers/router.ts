import * as express from 'express';
import { Router as ERouter } from 'express';
import { usersServices } from '../services/service';

class Router {
  /**
   * Express router to mount books related functions on.
   * @type {Express.Router}
   * @const
   */
  private readonly router: ERouter = ERouter();

  constructor() {
    const router: ERouter = ERouter();
    /**
       * Route serving all users.
       * @name /users
       * @function
       * @inner
       * @param {string} path - Express path
       * @param {callback} middleware - Express middleware.
       */
    router.get('/users', async (req, res, next) => {
      const users = await usersServices.getAll();

      if (!users) {
        res.json({
          error: 'Users not found',
        });
        next('Users not found');
      }

      res.json(users);
    });

    /**
       * Route that creates a user.
       * @name /users/create
       * @function
       * @inner
       * @param {string} path - Express path
       * @param {callback} middleware - Express middleware.
       */
    router.post('/users/create', async (req, res, next) => {
      const result = await usersServices.create(req.body);

      if (!result) {
        res.json({
          error: 'Cannot create a user',
        });
        next('Cannot create a user');
      }

      res.json({
        status: 'success',
      });
    });
    this.router = router;
  }

  init(app: express.Application) {
    app.use(this.router);
  }
}

export default new Router();
