import * as express from 'express';
import ValidationError from '../../middleware/ValidationError';
import { UserService } from '../../services/userService';
import { UserValidation } from '../users/validation';
import { AuthService } from '../../services/authService';
import { IUser } from '../../interfaces/user.interface';
import AuthenticationError from '../../middleware/AuthError';

export class AuthController {
  private userServices: UserService = new UserService();

  private authService: AuthService = new AuthService();

  private userValidation: UserValidation = new UserValidation();

  public signIn = async (req, res, _next): Promise<express.Response> => {
    const { error } = this.userValidation.signIn(req.body);

    if (error) throw new ValidationError(error.details);

    const user = await this.authService.verifyUser(req.body);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    const tokens = await this.authService.login(user);

    return res.json(tokens);
  }

  public signUp = async (req, res, _next): Promise<express.Response> => {
    const { error } = this.userValidation.signUp(req.body);

    if (error) throw new ValidationError(error.details);

    req.body.rooms = [];
    const user: IUser = await this.userServices.create(req.body);

    return res.json(user);
  }

  public refreshToken = async (req, res, next): Promise<express.Response> => {
    try {
      const user = await this.authService.getByToken(req.body.refreshToken);

      const oldRefreshToken: string = await this.authService.getRefreshTokenByLogin(user.login);
      // if the old refresh token is not equal to request refresh token then this user is unauthorized
      if (!oldRefreshToken || oldRefreshToken !== req.body.refreshToken) {
        throw new Error();
      }
      const newTokens = await this.authService.login(user);

      return res.json(newTokens);
    } catch (error) {
      return next(new AuthenticationError('Refresh token were missing or incorrect'));
    }
  }

  public logout = async (req, res, _next): Promise<express.Response> => {
    const deletedUserCount = await this.authService.deleteTokenByLogin(req.user.details.login);

    if (deletedUserCount === 0) {
      throw new AuthenticationError('Token were missing or incorrect');
    }

    return res.json({ status: 'done' });
  }
}
