import 'reflect-metadata';
import * as http from 'http';
import * as express from 'express';
import InversifyApp from './utils/inversify.config';

class Server {
  private app: express.Application;

  constructor() {
    this.app = new InversifyApp().init();
  }

  public start(): http.Server {
    return this.app.listen(this.app.get('port'), () => {
      console.log(`server is listening on port: ${this.app.get('port')}`);
    });
  }
}

new Server().start();
