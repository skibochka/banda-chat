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
      const client = await Client.build(socket);
      client.on('new-message', (roomId, newMessage) => {
        socket.broadcast.emit(roomId, newMessage);
      });
    });
    return serverInstance;
  }
}

new Server().start();
