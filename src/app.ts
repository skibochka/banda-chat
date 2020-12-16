import * as http from 'http';
import * as express from 'express';
import { config } from 'dotenv';
import Config from './utils/app.config';
import AuthRouter from './controllers/auth/router';
import UserRouter from './controllers/users/router';
import ErrorHandler from './middleware/errorHandler';
import * as io from 'socket.io';
import { Client } from './controllers/messages/client';


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
    const serverInstance = this.app.listen(this.app.get('port'), () => {
      console.log(`Server is running on port ${this.app.get('port')}`);
    });
    const ioServer = new io.Server(serverInstance);

    ioServer.on('connection', async (socket) => {
      console.log(`user ${socket.id} is connected`);
      const client = await Client.build(socket);
      client.on('new-event', (data) => {
        ioServer.emit(data.event, data.content);
      });
    });
    return serverInstance;
  }
}

new Server().start();
