import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import * as path from 'path';

class Config {
  public init(app: express.Application): void {
    app.use('/images', express.static(path.join(__dirname, '/../public/images')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compression());
    app.use(fileUpload());
    // app.use(helmet());
    app.use(cors());
    app.set('port', process.env.PORT || 3000);
  }
}

export default new Config();
