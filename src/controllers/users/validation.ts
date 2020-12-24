import * as Joi from '@hapi/joi';

export class UserValidation {
  public signUp(data) {
    return Joi
      .object({
        name: Joi
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

  public checkUser(data) {
    return Joi
      .object({
        email: Joi
          .string()
          .required(),
        password: Joi
          .string()
          .required(),
      })
      .validate(data);
  }

  public validateFile(data) {
    return Joi
      .object({
        name: Joi
          .string(),
        data: Joi
          .binary(),
        mimetype: Joi
          .string()
          .regex(/image\/(jpg|jpeg|png)/),
        size: Joi
          .number(),
        encoding: Joi
          .string(),
        tempFilePath: Joi
          .string()
          .allow('')
          .optional(),
        truncated: Joi
          .boolean(),
        md5: Joi
          .string(),
        mv: Joi
          .optional(),
      })
      .validate(data);
  }
}
