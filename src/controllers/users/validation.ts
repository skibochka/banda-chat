import * as Joi from '@hapi/joi';
import { injectable } from 'inversify';

@injectable()
export class UserValidation {
  public checkUser(data) {
    return Joi
      .object({
        login: Joi
          .string()
          .required(),
        password: Joi
          .string()
          .required(),
      })
      .validate(data);
  }
}
