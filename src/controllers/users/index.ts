import {
  controller, httpGet, httpPost, BaseHttpController,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { JsonResult } from 'inversify-express-utils/dts/results';
import { UserService } from '../../services/userService';
import { UserValidation } from './validation';
import ValidationError from '../../middleware/ValidationError';
import { IUser } from '../../interfaces/user.interface';
import TYPES from '../../constants/types';

@controller('/users')
export class UsersController extends BaseHttpController {
    @inject(TYPES.UserService) private userService: UserService;

    @inject(TYPES.UserValidation) private userValidation: UserValidation;

  @httpGet('/')
    private async getAll(): Promise<JsonResult> {
      const users = await this.userService.getAll();
      if (!users) {
        throw new Error('User not found');
      }

      return this.json(users, 200);
    }

  @httpPost('/create')
  private async create(): Promise<JsonResult> {
    const { error } = this.userValidation.checkUser(this.httpContext.request.body);

    if (error) throw new ValidationError(error.details);

    const user: IUser = await this.userService.create(this.httpContext.request.body);

    return this.json(user, 200);
  }
}
