import * as express from 'express';
import { UserService } from '../../services/userService';
import { UserValidation } from './validation';
import ValidationError from '../../middleware/ValidationError';
import { IUser } from '../../interfaces/user.interface';

export class UserController {
  private userService: UserService = new UserService();

  private userValidation: UserValidation = new UserValidation();

  public getAll = async (_req, res, _next): Promise<express.Response> => {
    const users = await this.userService.getAll();
    if (!users) {
      throw new Error('User not found');
    }

    return res.json(users);
  }

  public create = async (req, res, _next): Promise<express.Response> => {
    const { error } = this.userValidation.checkUser(req.body);

    if (error) throw new ValidationError(error.details);

    const user: IUser = await this.userService.create(req.body);

    return res.json(user);
  }
}
