import { inject } from 'inversify';
import { controller, httpPost, BaseHttpController } from 'inversify-express-utils';
import ValidationError from '../../middleware/ValidationError';
import TYPES from '../../constants/types';
import { UserService } from '../../services/userService';
import { UserValidation } from '../users/validation';
import { AuthService } from '../../services/authService';
import { IUser } from '../../interfaces/user.interface';

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
      throw new Error('User not found');
    }
    const tokens = await this.authService.login(user);

    return res.status(200).send(tokens);
  }

  @httpPost('/sign-up')
  public async signup(req, res): Promise<Express.Response> {
    const { error } = this.userValidation.checkUser(req.body);

    if (error) throw new ValidationError(error.details);

    const user: IUser = await this.userServices.create(req.body);

    return res.status(200).send({
      user,
    });
  }
}

export default AuthController;
