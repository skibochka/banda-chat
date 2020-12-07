import { inject } from 'inversify';
import {
  controller, httpPost, BaseHttpController, httpGet,
} from 'inversify-express-utils';
import ValidationError from '../../middleware/ValidationError';
import TYPES from '../../constants/types';
import { UserService } from '../../services/userService';
import { UserValidation } from '../users/validation';
import { AuthService } from '../../services/authService';
import { IUser } from '../../interfaces/user.interface';
import { AuthenticationError } from '../../middleware/AuthError';

@controller('/auth')
class AuthController extends BaseHttpController {
  @inject(TYPES.UserService) private userServices: UserService;

  @inject(TYPES.AuthService) private authService: AuthService;

  @inject(TYPES.UserValidation) private userValidation: UserValidation;

  @httpPost('/sign-in')
  public async signIn(req, res): Promise<Express.Response> {
    const { error } = this.userValidation.checkUser(req.body);

    if (error) throw new ValidationError(error.details);

    const user = await this.authService.verifyUser(req.body);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    const tokens = await this.authService.login(user);

    return res.status(200).send(tokens);
  }

  @httpPost('/sign-up')
  public async signUp(req, res): Promise<Express.Response> {
    const { error } = this.userValidation.checkUser(req.body);

    if (error) throw new ValidationError(error.details);

    const user: IUser = await this.userServices.create(req.body);

    return res.status(200).send({
      user,
    });
  }

  @httpPost('/refreshToken')
  public async refreshToken(req, res, next): Promise<Express.Response> {
    try {
      const user = await this.authService.getByToken(req.body.refreshToken);

      const oldRefreshToken: string = await this.authService.getRefreshTokenByLogin(user.login);

      // if the old refresh token is not equal to request refresh token then this user is unauthorized
      if (!oldRefreshToken || oldRefreshToken !== req.body.refreshToken) {
        throw new Error();
      }
      const newTokens = await this.authService.login(user);

      return res.status(200).json(newTokens);
    } catch (error) {
      return next(new AuthenticationError('Refresh token were missing or incorrect'));
    }
  }

  @httpGet('/logout')
  public async logout(req, res): Promise<Express.Response> {
    const deletedUserCount = await this.authService.deleteTokenByLogin(this.httpContext.user.details.login);

    if (deletedUserCount === 0) {
      throw new AuthenticationError('Token were missing or incorrect');
    }

    return res.status(200).send({
      status: 'done',
    });
  }
}

export default AuthController;
