import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import Config from './app.config';
import TYPES from '../constants/types';
import '../controllers/users';
import '../controllers/auth';
import ErrorHandler from '../middleware/errorHandler';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { UserValidation } from '../controllers/users/validation';
import { AuthProvider } from '../controllers/auth/provider';

class InversifyApp {
  private server: InversifyExpressServer;

  constructor() {
    const container = new Container();

    container.bind<UserService>(TYPES.UserService).to(UserService);
    container.bind<AuthService>(TYPES.AuthService).to(AuthService);
    container.bind<UserValidation>(TYPES.UserValidation).to(UserValidation);

    this.server = new InversifyExpressServer(container, null, null, null, AuthProvider);
  }

  public init() {
    return this.server
      .setConfig(Config.init)
      .setErrorConfig(ErrorHandler.init)
      .build();
  }
}


export default InversifyApp;
