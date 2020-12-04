import UsersServices from '../../services/usersService';
import UsersValidation from './validation';
import ValidationError from '../../middleware/ValidationError';
import authService from '../../services/authService';
import { IUser } from '../../interfaces/users.interface';

class Auth {
  public async signin(req, res): Promise<Express.Response> {
    const { error } = UsersValidation.checkUser(req.body);

    if (error) throw new ValidationError(error.details);

    const user = await authService.verifyUser(req.body);
    if (!user) {
      throw new Error('User not found');
    }
    const tokens = await authService.login(user);

    return res.status(200).send(tokens);
  }

  public async signup(req, res): Promise<Express.Response> {
    const { error } = UsersValidation.checkUser(req.body);

    if (error) throw new ValidationError(error.details);

    const user: IUser = await UsersServices.create(req.body);

    return res.status(200).send({
      user,
    });
  }
}

export default new Auth();
