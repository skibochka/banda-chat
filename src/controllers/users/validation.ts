import * as Joi from '@hapi/joi';

export class UserValidation {
  public signUp(data) {
    return Joi
      .object({
        login: Joi
          .string()
          .required(),
        email: Joi
          .string()
          .required(),
        password: Joi
          .string()
          .required(),
      })
      .validate(data);
  }

  public signIn(data) {
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
