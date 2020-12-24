import * as JwtService from 'jsonwebtoken';
import authConstants from '../../constants/constants';
import { AuthService } from '../../services/authService';
import AuthenticationError from '../../middleware/AuthError';

export class AuthProvider {
  private readonly authService: AuthService = new AuthService();

  private readonly jwtService: JwtService = JwtService;

  private validate = (token: string | string[]) => {
    return this.jwtService.verify(token, authConstants.secret);
  }

  public authenticate = async (req, _res, next): Promise<void> => {
    let error: boolean = false;
    const data = {
      _id: null,
      login: null,
    };
    const token = req.headers['x-auth-token'];
    if (token) {
      const user = this.validate(token);
      if (await this.authService.getRefreshTokenByEmail(user.email) !== null) {
        data._id = user._id;
        data.login = user.login;
      } else {
        error = true;
      }
    } else {
      error = true;
    }
    if (error) throw new AuthenticationError('Login first');
    req.user = { details: data };
    next();
  }
}
