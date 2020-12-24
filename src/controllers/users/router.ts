import * as express from 'express';
import BaseRouter from '../../utils/BaseRouter';
import { AuthProvider } from '../auth/provider';
import { UserController } from './index';

class UserRouter extends BaseRouter {
  private readonly router: express.Router = express.Router();

  private readonly userController: UserController = new UserController();

  private readonly authProvider: AuthProvider = new AuthProvider();

  constructor() {
    super();
    const router: express.Router = express.Router();

    router.get(
      '/all',
      this.asyncWrapper(this.authProvider.authenticate),
      this.asyncWrapper(this.userController.getAll),
    );

    router.post(
      '/create',
      this.asyncWrapper(this.authProvider.authenticate),
      this.asyncWrapper(this.userController.create),
    );

    router.post(
      '/newAvatar',
      this.asyncWrapper(this.userController.changeAvatar),
    );

    this.router = router;
  }

  public init(app: express.Application) {
    app.use('/user/', this.router);
  }
}

export default new UserRouter();
