import * as express from 'express';
import BaseRouter from '../../utils/BaseRouter';
import { AuthController } from './index';
import { AuthProvider } from './provider';

export class AuthRouter extends BaseRouter {
  private readonly router: express.Router;

  private readonly authController: AuthController = new AuthController();

  private readonly authProvider = new AuthProvider();

  constructor() {
    super();
    const router: express.Router = express.Router();

    router.post(
      '/sign-in',
      this.asyncWrapper(this.authController.signIn),
    );

    router.post(
      '/sign-up',
      (req, res, next) => {
        req.body = JSON.parse(req.body.data);
        return next();
      },
      this.asyncWrapper(this.authController.signUp),
    );

    router.post(
      '/refreshToken',
      this.asyncWrapper(this.authController.refreshToken),
    );

    router.post(
      '/logout',
      this.asyncWrapper(this.authProvider.authenticate),
      this.asyncWrapper(this.authController.logout),
    );

    this.router = router;
  }

  public init(app: express.Application) {
    app.use('/auth', this.router);
  }
}

export default new AuthRouter();
