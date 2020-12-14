import * as http from 'http';
import * as express from 'express';
import { config } from 'dotenv';
import Config from './utils/app.config';
import AuthRouter from './controllers/auth/router';
import UserRouter from './controllers/users/router';
import ErrorHandler from './middleware/errorHandler';

config();

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    Config.init(this.app);

    AuthRouter.init(this.app);
    UserRouter.init(this.app);

    ErrorHandler.init(this.app);
  }

  public start(): http.Server {
    return this.app.listen(this.app.get('port'), () => {
      console.log(`server is listening on port: ${this.app.get('port')}`);
    });
  }
}

new Server().start();
