import * as http from 'http';
import * as express from 'express';
import Router from './controllers/router';
import Middleware from './middleware';


class Server {
  private app: express.Application;

  constructor() {
    const app: express.Application = express();
    Middleware.init(app);
    Router.init(app);
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
