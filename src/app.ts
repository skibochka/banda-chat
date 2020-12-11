import 'reflect-metadata';
import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import InversifyApp from './utils/inversify.config';
import { Client } from './controllers/messages/client';

class Server {
  private app: express.Application;

  constructor() {
    this.app = new InversifyApp().init();
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
