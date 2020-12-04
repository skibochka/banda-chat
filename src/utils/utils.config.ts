import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as express from 'express';

export default class Utils {
  static init(app: express.Application): void {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compression());
    app.use(helmet());
    app.use(cors());
  }
}
