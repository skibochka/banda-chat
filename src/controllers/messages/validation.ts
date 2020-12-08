import * as Joi from '@hapi/joi';

class MessageValidation {
  public checkMessage(data) {
    return Joi
      .object({
        content: Joi
          .string()
          .required(),
        sender: Joi
          .string()
          .required(),
      })
      .validate(data);
  }
}
export default new MessageValidation();
