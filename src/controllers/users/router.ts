import * as express from 'express';
import { Router as ERouter } from 'express';
import Users from './index';

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
    router.get('/users', Users.getAll);

    /**
       * Route that creates a user.
       * @name /users/create
       * @function
       * @inner
       * @param {string} path - Express path
       * @param {callback} middleware - Express middleware.
       */
    router.post('/users/create', Users.create);

    this.router = router;
  }

  init(app: express.Application) {
    app.use(this.router);
  }
}

export default new Router();
