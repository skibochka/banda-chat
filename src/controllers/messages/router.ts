import * as express from 'express';
import * as path from 'path';
import BaseRouter from '../../utils/BaseRouter';
import { AuthProvider } from '../auth/provider';

export class PublicRouter extends BaseRouter {
  private readonly router: express.Router;

  private readonly authProvider = new AuthProvider();

  constructor() {
    super();
    const router: express.Router = express.Router();

    router.get(
      '/login',
      this.asyncWrapper((req, res) => {
        res.sendFile(path.join(__dirname, '../../public/login.html'));
      }),
    );

    router.get(
      '/register',
      this.asyncWrapper((req, res) => {
        res.sendFile(path.join(__dirname, '../../public/register.html'));
      }),
    );

    router.get(
      '/chat',
      this.asyncWrapper((req, res) => {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
      }),
    );

    this.router = router;
  }

  public init(app: express.Application) {
    app.use('/', this.router);
  }
}

export default new PublicRouter();
