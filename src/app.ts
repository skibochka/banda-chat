import * as http from 'http';
import * as express from 'express';
import { config } from 'dotenv';
import * as io from 'socket.io';
import Config from './utils/app.config';
import AuthRouter from './controllers/auth/router';
import PublicRouter from './controllers/messages/router'
import UserRouter from './controllers/users/router';
import ErrorHandler from './middleware/errorHandler';
import { Client } from './controllers/messages/client';


class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    Config.init(this.app);

    AuthRouter.init(this.app);
    UserRouter.init(this.app);
    PublicRouter.init(this.app);

    ErrorHandler.init(this.app);
  }

  public start(): http.Server {
    const serverInstance = this.app.listen(this.app.get('port'), () => {
      console.log(`Server is running on port ${this.app.get('port')}`);
    });
    const ioServer = new io.Server(serverInstance);

    ioServer.on('connection', async (socket) => {
      await Client.build(socket);
    });
    return serverInstance;
  }
}

new Server().start();
