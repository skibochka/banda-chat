import * as express from 'express';
import { Router as ERouter } from 'express';
import BaseRouter from '../../utils/BaseRouter';
import Users from './index';

class Router extends BaseRouter {
  /**
   * Express router.
   * @type {Express.Router}
   * @const
   */
  private readonly router: ERouter = ERouter();

  constructor() {
    super();
    const router: ERouter = ERouter();
    /**
       * Route for signing in
       * @name /auth/sign-in
       * @function
       * @inner
       * @param {string} path - Express path
       * @param {callback} middleware - Express middleware.
       */
    router.post('/auth/sign-in', this.asyncWrapper(Users.signin));

    /**
       * Route for signing up
       * @name /auth/sign-up
       * @function
       * @inner
       * @param {string} path - Express path
       * @param {callback} middleware - Express middleware.
       */
    router.post('/auth/sign-up', this.asyncWrapper(Users.signup));

    this.router = router;
  }

  init(app: express.Application) {
    app.use(this.router);
  }
}

export default new Router();
