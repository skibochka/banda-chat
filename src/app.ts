import * as http from 'http';
import * as express from 'express';
import Router from './controllers/users/router';
import Middleware from './middleware/middleware';
import ErrorHandler from './error/errorHandler';


class Server {
  private app: express.Application;

  constructor() {
    const app: express.Application = express();
    Middleware.init(app);
    Router.init(app);
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
