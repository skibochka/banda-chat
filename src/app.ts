import * as http from 'http';
import * as express from 'express';
import UsersRouter from './controllers/users/router';
import AuthRouter from './controllers/auth/router';
import Utils from './utils/utils.config';
import ErrorHandler from './middleware/errorHandler';


class Server {
  private app: express.Application;

  constructor() {
    const app: express.Application = express();
    Utils.init(app);

    AuthRouter.init(app);
    UsersRouter.init(app);

    ErrorHandler.init(app);
    app.set('port', process.env.PORT || 3000);
    this.app = app;
  }

  public start(): http.Server {
    return this.app.listen(this.app.get('port'), () => {
      console.log(`server is listening on port: ${this.app.get('port')}`);
    });
  }
}

new Server().start();
