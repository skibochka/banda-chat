import * as express from 'express';
import * as fs from 'fs';
import * as uniqueId from 'uniqid';
import { UserService } from '../../services/userService';
import { UserValidation } from './validation';
import ValidationError from '../../middleware/ValidationError';
import { IUser } from '../../interfaces/user.interface';
import { AuthService } from '../../services/authService';

export class UserController {
  private userService: UserService = new UserService();

  private authService: AuthService = new AuthService();

  private userValidation: UserValidation = new UserValidation();

  public getAll = async (req, res): Promise<express.Response> => {
    const users = await this.userService.getAll();
    if (!users) {
      throw new Error('User not found');
    }

    return res.json(users);
  }

  public create = async (req, res): Promise<express.Response> => {
    const { error } = this.userValidation.checkUser(req.body);

    if (error) throw new ValidationError(error.details);

    const user: IUser = await this.userService.create(req.body);

    return res.json(user);
  }

  public changeAvatar = async (req, res): Promise<express.Response> => {
    const { error } = this.userValidation.validateFile(req.files.newAvatar);

    if (error) throw new ValidationError(error.details);

    const { email } = this.authService.getByToken(req.headers.authorization.split(' ')[1]);
    const { avatar }: IUser = await this.userService.getOne(email);
    const oldAvatarName = avatar.split('/')[2];
    const newAvatarName = uniqueId('', req.files.newAvatar.name);

    await fs.unlink(`src/public/images/${oldAvatarName}`, (err) => { if (err) console.error(err); });
    await fs.writeFile(`src/public/images/${newAvatarName}`, req.files.newAvatar.data, (err) => {
      if (err) console.error(err);
    });
    await this.userService.updateUser(email, { avatar: `/images/${newAvatarName}` });

    return res.json({
      newAvatarPath: `/images/${newAvatarName}`,
    });
  }
}
