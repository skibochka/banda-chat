import * as express from 'express';
import * as JwtService from 'jsonwebtoken';
import { injectable, inject } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import TYPES from '../../constants/types';
import authConstants from '../../constants/constants';
import { AuthService } from '../../services/authService';
import { Principal } from './principal';
import { AuthenticationError } from '../../middleware/AuthError';

const authService = inject(TYPES.AuthService);

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
  @authService private readonly authService: AuthService;

  private readonly jwtService: JwtService = JwtService;

  private readonly skipRoutes: string[] = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/refreshToken',
  ];

  private checkRoutes(url: string): boolean {
    // eslint-disable-next-line consistent-return
    let status = true;
    this.skipRoutes.forEach((value, id) => {
      if (url === value) {
        status = false;
      }
    });
    return status;
  }

  private validate(token: string | string[]) {
    try {
      return this.jwtService.verify(token, authConstants.secret);
    } catch (e) {
      if (e instanceof this.jwtService.TokenExpiredError) {
        return {
          error: 'jwt expired',
          _id: null,
          login: null,
        };
      }
      return {
        _id: null,
        login: null,
      };
    }
  }

  public async getUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<interfaces.Principal> {
    const data = {
      _id: null,
      login: null,
    };
    const token = req.headers['x-auth-token'];
    if (token) {
      const user = this.validate(token);
      if (user.error && user.error === 'jwt expired') {
        next(new AuthenticationError('Token expired'));
      }
      if (this.authService.getRefreshTokenByLogin(user.login)) {
        data._id = user._id;
        data.login = user.login;
      }
    }
    const principal = new Principal(data);
    if (this.checkRoutes(req.url)) {
      if (!await principal.isAuthenticated()) {
        next(new AuthenticationError('Login first'));
      }
    }
    return principal;
  }
}
